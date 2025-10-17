import {
    Indexer,
    PresetValue,
    StorybookConfigRaw,
} from 'storybook/internal/types';
import { vite, webpack } from './unplugin';
import { configIndexer } from './indexers/configIndexer';
import { cssIndexer } from './indexers/cssIndexer';
import { detectVersionFromStories } from './core/version-detection/stories-detector';
import { TailwindThemeLoader } from './core/theme-loader/TailwindThemeLoader';

// TODO: Add warning if you have both tailwind v3 and v4 paths specified
// (i.e. can only have config indexed or css indexed, not both)
export const experimental_indexers: Indexer[] = [configIndexer, cssIndexer];

export const viteFinal = async (config: any, options: any) => {
    const { plugins = [] } = config;
    const stories: PresetValue<StorybookConfigRaw['stories']> =
        await options.presets.apply('stories');
    const themeLoader = new TailwindThemeLoader(stories);
    const loaderStrategy = themeLoader.getStrategy();
    if (loaderStrategy === null) {
        return config; // Skip plugin injection
    }
    plugins.push(vite({ ...options, loaderStrategy }));
    config.plugins = plugins;
    return config;
};

// TODO: Webpack support
