import {
    Indexer,
    PresetValue,
    StorybookConfigRaw,
} from 'storybook/internal/types';
import { vite } from './unplugin';
import { configIndexer } from './indexers';
import { cssIndexer } from './indexers';
import { ThemeLoaderManager } from './core/theme-loader';
import { AddonOptions } from './indexers/AddonOptions';

export async function experimental_indexers(
    existingIndexers: any[],
    options: any
) {
    const addonOptions = new AddonOptions(
        options.defaultPath,
        options.sections,
        options.singleFileName
    );
    return [
        ...existingIndexers,
        configIndexer(addonOptions),
        cssIndexer(addonOptions),
    ];
}
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

// TODO: Webpack support
