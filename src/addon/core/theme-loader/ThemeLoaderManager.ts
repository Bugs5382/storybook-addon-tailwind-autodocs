import { ConfigLoader, CssLoader, ThemeLoader } from './loaders';
import { PresetValue, StorybookConfigRaw } from 'storybook/internal/types';
import { Logger } from '../../util';
import { TailwindPackageVersionDetector } from '../package-detection';
import { MIN_SUPPORTED_TAILWIND_VERSION } from '../../constants';

const DEFAULT_STORY_FILES = '**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))';

export class ThemeLoaderManager {
    private _loader: ThemeLoader | null = null;
    private tailwindPackageVersionDetector: TailwindPackageVersionDetector;

    public constructor(
        stories: PresetValue<StorybookConfigRaw['stories']>,
        loaders?: ThemeLoader[],
        tailwindPackageVersionDetector?: TailwindPackageVersionDetector
    ) {
        const availableLoaders =
            loaders && loaders.length > 0
                ? loaders
                : [new ConfigLoader(), new CssLoader()];

        this.tailwindPackageVersionDetector =
            tailwindPackageVersionDetector ??
            new TailwindPackageVersionDetector();

        this.selectLoader(stories, availableLoaders);

        if (this._loader === null) {
            Logger.warn('Skipping Tailwind theme detection...');
        }
    }

    public getLoader(): ThemeLoader | null {
        return this._loader;
    }

    // TODO: Tests
    public extractStoryPaths(
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

    private selectLoader(
        stories: PresetValue<StorybookConfigRaw['stories']>,
        availableLoaders: ThemeLoader[]
    ): void {
        const storyFilePaths = this.extractStoryPaths(stories);

        const matchingLoaders = availableLoaders.filter(loader =>
            loader.hasMatch(storyFilePaths)
        );

        if (matchingLoaders.length === 0) {
            Logger.error(
                "No Tailwind configuration file specified in stories of Storybook's main.ts."
            );
            return;
        }

        const installedTailwindMajorVersion =
            this.tailwindPackageVersionDetector.getTailwindVersionIfGreaterThanMinimum();

        if (installedTailwindMajorVersion === null) {
            Logger.warn(
                `Please make sure Tailwind CSS v${MIN_SUPPORTED_TAILWIND_VERSION}.x or higher is installed to use this addon`
            );
            return;
        }

        if (matchingLoaders.length > 1) {
            Logger.warn(
                'Multiple tailwind configuration files specified. ' +
                    `It looks like you have v${installedTailwindMajorVersion}.x installed. Please specify one ` +
                    'configuration approach (a single CSS or tailwind.config file). For clarity, only specify one configuration approach.'
            );
            return;
        }

        this._loader = this.getLoaderByVersion(
            matchingLoaders,
            installedTailwindMajorVersion,
            storyFilePaths
        );
    }

    /**
     * Select a loader that supports the installed Tailwind version
     * @param loaders - Available loaders that matched configuration files
     * @param version - Installed Tailwind major version
     * @param storyPaths - Story file paths to identify which files are incompatible
     * @returns A matching loader or null if none support the installed version
     */
    private getLoaderByVersion(
        loaders: ThemeLoader[],
        version: number,
        storyPaths: string[]
    ): ThemeLoader | null {
        const matchingLoader =
            loaders.find(loader => loader.isVersionSupported(version)) ?? null;

        if (matchingLoader === null) {
            loaders.forEach(loader => {
                storyPaths
                    .filter(path => loader.isRegexMatch(path))
                    .forEach(path => {
                        Logger.error(
                            `Version mismatch: Tailwind v${version}.x is installed, but '${path}' ` +
                                `is only supported by Tailwind ${loader.supportedVersionLabel()}.`
                        );
                    });
            });
        }

        return matchingLoader;
    }
}
