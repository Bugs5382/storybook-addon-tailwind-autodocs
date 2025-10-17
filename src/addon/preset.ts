import {
    Indexer,
    PresetValue,
    StorybookConfigRaw,
} from 'storybook/internal/types';
import { vite } from './unplugin';
import { configIndexer } from './core/indexers';
import { cssIndexer } from './core/indexers';
import { TailwindThemeLoader } from './core/theme-loader/TailwindThemeLoader';

export const experimental_indexers: Indexer[] = [configIndexer, cssIndexer];

export const viteFinal = async (config: any, options: any) => {
    const { plugins = [] } = config;
    const stories: PresetValue<StorybookConfigRaw['stories']> =
        await options.presets.apply('stories');
    const themeLoader = new TailwindThemeLoader(stories);
    const loaderStrategy = themeLoader.getStrategy();
    if (loaderStrategy === null) return config; // Skip plugin injection
    plugins.push(vite({ ...options, loaderStrategy }));
    config.plugins = plugins;
    return config;
};

// TODO: Add webpack support
