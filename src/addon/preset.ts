import type { Indexer } from 'storybook/internal/types';
import { vite, webpack } from './unplugin';
import { configIndexer } from './indexers/configIndexer';
import { cssIndexer } from './indexers/cssIndexer';
import { getVersionFromStories } from './core/get-version-from-stories';

// TODO: Add warning if you have both tailwind v3 and v4 paths specified
// (i.e. can only have config indexed or css indexed, not both)
export const experimental_indexers: Indexer[] = [configIndexer, cssIndexer];

export const viteFinal = async (config: any, options: any) => {
    const { plugins = [] } = config;
    const stories = await options.presets.apply('stories');
    const tailwindVersion = getVersionFromStories(stories);
    if (tailwindVersion === null) {
        console.warn(
            '[storybook-addon-tailwind-autodocs] Skipping Tailwind theme detection'
        );
        return config; // Skip plugin injection
    }
    plugins.push(vite({ ...options, tailwindVersion }));
    config.plugins = plugins;
    return config;
};

// TODO: Test webpack
// export const webpackFinal = async (config: any, options: any) => {
//     const { plugins = [] } = config;
//     plugins.push(webpack(options || {}));
//     config.plugins = plugins;
//     return config;
// };
