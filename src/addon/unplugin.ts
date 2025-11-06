import { createUnplugin } from 'unplugin';
import { VIRTUAL_FILE_PREFIX } from './constants';
import { PluginOptions } from './types';
import { CsfGenerator, ThemeTransformer } from './core/theme-transformer';

const unplugin = createUnplugin((options: PluginOptions) => {
    const themeLoader = options.themeLoader;
    const csfGenerator = new CsfGenerator(options.addonOptions);
    const themeTransformer = new ThemeTransformer(csfGenerator);

    return {
        name: 'unplugin-tailwind-autodocs',
        enforce: 'pre',
        resolveId(id) {
            const baseResolveId = themeLoader.baseResolveId(id);
            if (baseResolveId === null) return null;
            return baseResolveId + '.js';
        },
        loadInclude(id) {
            return id.startsWith(VIRTUAL_FILE_PREFIX);
        },
        async load(id) {
            if (id.startsWith(VIRTUAL_FILE_PREFIX)) {
                // Remove the .js extension we added in resolveId method
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

export const { vite } = unplugin;
