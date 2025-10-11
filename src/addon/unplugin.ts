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
                    delete require.cache[realPath]; // FIXME: Correct for HMR
                    const fullTailwindConfig = await getV3Config(realPath);
                    const colors = fullTailwindConfig.theme.colors;
                    return generateCsf(colors); // TODO: Why doesn't this work if its not jsx?
                }
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
                const config = getV4Config(realPath);
                const colors = config.theme.colors;
                return generateCsf(colors); // TODO: Why doesn't this work if its not jsx?
            }
        },
    };
});

export const { vite, webpack } = unplugin;
