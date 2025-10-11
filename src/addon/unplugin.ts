import { createUnplugin } from 'unplugin';
import { generateCsf } from './compile';
import { TAILWIND_CONFIG_REGEX, TAILWIND_CSS_REGEX } from './constants';
import { getV4Config } from './getV4Config';
import { getV3Config } from './getV3Config';
import { serverRequire } from 'storybook/internal/common';

const VIRTUAL_PREFIX = '\0unplugin-css-stories:';

export const unplugin = createUnplugin(() => {
    return {
        name: 'unplugin-css-stories',
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
