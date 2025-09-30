import { createUnplugin } from 'unplugin';
import { generateCsf } from './compile';
import { TAILWIND_CONFIG_REGEX } from './constants';
import { getV3Config } from './getV3Config';

export const unplugin = createUnplugin((options = {}) => {
    const { tailwindVersion = 3 } = options;
    console.log('Tailwind version set to: ', tailwindVersion);
    return {
        name: 'unplugin-tailwind-v3-autodocs',
        enforce: 'pre',
        loadInclude(id) {
            return TAILWIND_CONFIG_REGEX.test(id);
        },

        resolveId(id) {
            if (TAILWIND_CONFIG_REGEX.test(id)) {
                // Return the id with .tsx extension to indicate its TypeScript JSX
                return id + '?virtual.tsx';
            }
        },
        async load(fileName) {
            const cleanFileName = fileName.replace('?virtual.tsx', '');
            delete require.cache[cleanFileName];
            const fullTailwindConfig = await getV3Config(cleanFileName);
            const colors = fullTailwindConfig.theme.colors;
            return await generateCsf(colors);
        },
    };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
