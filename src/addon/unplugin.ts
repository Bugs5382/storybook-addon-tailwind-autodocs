import { createUnplugin } from 'unplugin';
import { generateCsf } from './compile';
import { VIRTUAL_FILE_PREFIX } from './constants';
import { AddonOptions } from './types';
import { ThemeTransformer } from './core/theme-transformer/ThemeTransformer';

const unplugin = createUnplugin((options: AddonOptions) => {
    const themeLoader = options.themeLoader;
    const themeTransformer = new ThemeTransformer(); // TODO: Remember that any options passed in here could also be passed in by the user

    return {
        name: 'unplugin-tailwind-autodocs',
        enforce: 'pre',
        resolveId(id) {
            if (themeLoader.isRegexMatch(id)) {
                return VIRTUAL_FILE_PREFIX + id + '.js'; // TODO: Why doesn't this work if its not jsx?
            }
            return null;
        },
        loadInclude(id) {
            return id.startsWith(VIRTUAL_FILE_PREFIX);
        },
        async load(id) {
            if (id.startsWith(VIRTUAL_FILE_PREFIX)) {
                // Remove the .js extension we added
                // FIXME: Something more robust that -3 to remove.js and virtual_prefix
                const realPath = id.slice(VIRTUAL_FILE_PREFIX.length, -3);

                // Watch the config file for all bundlers - mainly for webpack
                if (this.addWatchFile) {
                    this.addWatchFile(realPath);
                }
                const fullTailwindConfig =
                    await themeLoader.getTailwindTheme(realPath);

                return themeTransformer.transformToCsf(fullTailwindConfig); // TODO: Why doesn't this work if its not jsx?
            }
        },
        vite: {
            handleHotUpdate({ file, server }) {
                if (themeLoader.isRegexMatch(file)) {
                    delete require.cache[file];
                    const virtualModuleId = VIRTUAL_FILE_PREFIX + file + '.js';
                    const module =
                        server.moduleGraph.getModuleById(virtualModuleId);
                    if (module) {
                        server.moduleGraph.invalidateModule(module);
                    }
                    server.ws.send({ type: 'full-reload' });
                }
            },
        },
    };
});

export const { vite, webpack } = unplugin;
