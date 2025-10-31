import {
    Indexer,
    PresetValue,
    StorybookConfigRaw,
} from 'storybook/internal/types';
import { vite, webpack } from './unplugin';
import { configIndexer } from './indexers';
import { cssIndexer } from './indexers';
import { ThemeLoaderManager } from './core/theme-loader';

export const experimental_indexers: Indexer[] = [configIndexer, cssIndexer];

export const viteFinal = async (config: any, options: any) => {
    const { plugins = [] } = config;
    const stories: PresetValue<StorybookConfigRaw['stories']> =
        await options.presets.apply('stories');
    const themeLoaderManager = new ThemeLoaderManager(stories);
    const themeLoader = themeLoaderManager.getLoader();
    if (themeLoader === null) return config; // Skip plugin injection
    plugins.push(vite({ ...options, themeLoader: themeLoader }));
    config.plugins = plugins;
    return config;
};

export const webpackFinal = async (config: any, options: any) => {
    const { plugins = [] } = config;
    const stories = await options.presets.apply('stories');
    const themeLoaderManager = new ThemeLoaderManager(stories);
    const themeLoader = themeLoaderManager.getLoader();
    if (themeLoader === null) return config;
    plugins.push(webpack({ ...options, themeLoader }));
    config.plugins = plugins;
    return config;
};
