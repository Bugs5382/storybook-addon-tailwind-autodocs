import { createUnplugin } from 'unplugin';
import { generateCsf } from './compile';
import { VIRTUAL_FILE_PREFIX } from './constants';
import { AddonOptions } from './types';

const unplugin = createUnplugin((options: AddonOptions) => {
    const loaderStrategy = options.loaderStrategy;
    return {
        name: 'unplugin-tailwind-autodocs',
        enforce: 'pre',
        resolveId(id) {
            if (loaderStrategy.isRegexMatch(id)) {
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
                    await loaderStrategy.getTailwindConfig(realPath);

                const colors = fullTailwindConfig.theme.colors;
                const twTypography = {
                    fontSizes: fullTailwindConfig.theme.fontSize,
                    fontWeights: fullTailwindConfig.theme.fontWeight,
                    fontFamilies: fullTailwindConfig.theme.fontFamily,
                };
                return generateCsf(colors, twTypography); // TODO: Why doesn't this work if its not jsx?
            }
        },
        vite: {
            handleHotUpdate({ file, server }) {
                if (loaderStrategy.isRegexMatch(file)) {
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
