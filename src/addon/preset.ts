import { PresetValue, StorybookConfigRaw } from 'storybook/internal/types';
import { vite } from './unplugin';
import { configIndexer } from './indexers';
import { cssIndexer } from './indexers';
import { ThemeLoaderManager } from './core/theme-loader';
import { AddonOptions } from './core/theme-transformer';

export async function experimental_indexers(
    existingIndexers: any[],
    options: any
) {
    // TODO: Add themeLoader here but without logging? if themeLoader is null just returning the existingIndexers
    const addonOptions = new AddonOptions(
        options.defaultPath,
        options.sections,
        options.forceSingleDoc
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

    // Skip plugin injection if no theme loader is found
    if (themeLoader === null) return config;

    const addonOptions = new AddonOptions(
        options.defaultPath,
        options.sections,
        options.forceSingleDoc
    );
    plugins.push(
        vite({
            themeLoader: themeLoader,
            addonOptions: addonOptions,
        })
    );
    config.plugins = plugins;
    return config;
};

// TODO: Webpack support
