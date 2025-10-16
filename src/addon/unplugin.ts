import { createUnplugin, UnpluginFactory } from 'unplugin';
import { generateCsf } from './compile';
import { TAILWIND_CONFIG_REGEX, TAILWIND_CSS_REGEX } from './constants';
import { getV4Config } from './getV4Config';
import { getV3Config } from './getV3Config';
import { serverRequire } from 'storybook/internal/common';

const VIRTUAL_PREFIX = '\0tailwind-autodocs:'; // TODO: Move to constants

interface AddonOptions {
    tailwindVersion: 3 | 4;
}

const unplugin = createUnplugin((options: AddonOptions) => {
    const tailwindVersion = options.tailwindVersion;
    console.log('gotVersion', tailwindVersion);

    if (tailwindVersion === 3) {
        return {
            name: 'unplugin-css-stories-v3',
            enforce: 'pre',
            resolveId(id) {
                if (TAILWIND_CONFIG_REGEX.test(id)) {
                    return VIRTUAL_PREFIX + id + '.js'; // TODO: Why doesn't this work if its not jsx?
                }
                return null;
            },
            loadInclude(id) {
                return id.startsWith(VIRTUAL_PREFIX);
            },
            async load(id) {
                if (id.startsWith(VIRTUAL_PREFIX)) {
                    // Remove the .js extension we added
                    const realPath = id.slice(VIRTUAL_PREFIX.length, -3);

                    // Watch the config file for all bundlers - mainly for webpack
                    if (this.addWatchFile) {
                        this.addWatchFile(realPath);
                    }

                    // Clear cache on every load
                    delete require.cache[realPath];
                    const fullTailwindConfig = await getV3Config(realPath);
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
                    if (TAILWIND_CONFIG_REGEX.test(file)) {
                        delete require.cache[file];
                        const virtualModuleId = VIRTUAL_PREFIX + file + '.js';
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
    }
    return {
        name: 'unplugin-css-stories-v4',
        enforce: 'pre',
        resolveId(id) {
            if (TAILWIND_CSS_REGEX.test(id)) {
                return VIRTUAL_PREFIX + id + '.js'; // TODO: Why doesn't this work if its not jsx?
            }
            return null;
        },
        loadInclude(id) {
            return id.startsWith(VIRTUAL_PREFIX);
        },
        async load(id) {
            if (id.startsWith(VIRTUAL_PREFIX)) {
                // Remove the .js extension we added
                const realPath = id.slice(VIRTUAL_PREFIX.length, -3);
                console.log(realPath);
                const fullTailwindConfig = await getV4Config(realPath);
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
                if (TAILWIND_CSS_REGEX.test(file)) {
                    delete require.cache[file];
                    const virtualModuleId = VIRTUAL_PREFIX + file + '.js';
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
