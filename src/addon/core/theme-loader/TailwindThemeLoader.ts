import {
    ConfigLoaderStrategy,
    CssLoaderStrategy,
    LoaderStrategy,
} from './strategies';
import { PresetValue, StorybookConfigRaw } from 'storybook/internal/types';
import { Logger } from '../util';
import { TailwindPackageVersionDetector } from '../version-detection';
import { MIN_SUPPORTED_TAILWIND_VERSION } from '../../constants';

const DEFAULT_STORY_FILES = '**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))';

export class TailwindThemeLoader {
    private _strategy: LoaderStrategy | null = null;
    private tailwindPackageVersionDetector: TailwindPackageVersionDetector;

    constructor(
        stories: PresetValue<StorybookConfigRaw['stories']>,
        strategies?: LoaderStrategy[],
        tailwindPackageVersionDetector?: TailwindPackageVersionDetector
    ) {
        const availableStrategies =
            strategies && strategies.length > 0
                ? strategies
                : [new ConfigLoaderStrategy(), new CssLoaderStrategy()];

        this.tailwindPackageVersionDetector =
            tailwindPackageVersionDetector ??
            new TailwindPackageVersionDetector();

        this.selectStrategy(stories, availableStrategies);

        if (this._strategy === null) {
            Logger.warn('Skipping Tailwind theme detection...');
        }
    }

    getStrategy(): LoaderStrategy | null {
        return this._strategy;
    }

    extractStoryPaths(
        stories: PresetValue<StorybookConfigRaw['stories']>
    ): string[] {
        // Extract file paths from stories configuration
        return Array.isArray(stories)
            ? stories.flatMap(story => {
                  if (typeof story === 'string') {
                      return [story];
                  }
                  // story is StoriesSpecifier
                  const files = story.files || DEFAULT_STORY_FILES;
                  return [`${story.directory}/${files}`];
              })
            : [];
    }

    private selectStrategy(
        stories: PresetValue<StorybookConfigRaw['stories']>,
        availableStrategies: LoaderStrategy[]
    ): void {
        const storyFilePaths = this.extractStoryPaths(stories);

        const matchingStrategies = availableStrategies.filter(strategy =>
            strategy.hasMatch(storyFilePaths)
        );

        if (matchingStrategies.length === 0) {
            Logger.error(
                "No Tailwind configuration file specified in stories of Storybook's main.ts."
            );
            this._strategy = null;
            return;
        }

        const installedTailwindMajorVersion =
            this.tailwindPackageVersionDetector.getTailwindVersionIfGreaterThanMinimum();

        if (installedTailwindMajorVersion === null) {
            Logger.warn(
                `Please make sure Tailwind CSS v${MIN_SUPPORTED_TAILWIND_VERSION}.x or higher is installed to use this addon`
            );
            this._strategy = null;
            return;
        }

        if (matchingStrategies.length > 1) {
            Logger.warn(
                'Multiple tailwind configuration approaches specified.' +
                    `Defaulting to installed version (v${installedTailwindMajorVersion}.x). ` +
                    'For clarity, only specify one configuration approach.'
            );
        }

        this._strategy = this.getStrategyByVersion(
            matchingStrategies,
            installedTailwindMajorVersion,
            storyFilePaths
        );
    }

    /**
     * Select a strategy that supports the installed Tailwind version
     * @param strategies - Available strategies that matched configuration files
     * @param version - Installed Tailwind major version
     * @param storyPaths - Story file paths to identify which files are incompatible
     * @returns A matching strategy or null if none support the installed version
     */
    private getStrategyByVersion(
        strategies: LoaderStrategy[],
        version: number,
        storyPaths: string[]
    ): LoaderStrategy | null {
        const matchingStrategy =
            strategies.find(strategy => strategy.isVersionSupported(version)) ??
            null;

        if (matchingStrategy === null) {
            strategies.forEach(strategy => {
                storyPaths
                    .filter(path => strategy.isRegexMatch(path))
                    .forEach(path => {
                        Logger.error(
                            `Version mismatch: Tailwind v${version}.x is installed, but '${path}' ` +
                                `is only supported by Tailwind ${strategy.supportedVersionLabel()}.`
                        );
                    });
            });
        }

        return matchingStrategy;
    }
}
