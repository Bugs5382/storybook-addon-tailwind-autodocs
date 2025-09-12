import { createUnplugin } from 'unplugin';
import { serverRequire } from 'storybook/internal/common';
import { getCsfFromConfig } from './compile';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TAILWIND_REGEX } from './constants';

export const unplugin = createUnplugin(() => {
    return {
        name: 'unplugin-tailwind-autodocs',
        enforce: 'pre',
        loadInclude(id) {
            return TAILWIND_REGEX.test(id);
        },
        async load(fileName) {
            delete require.cache[fileName];
            const config = await serverRequire(fileName);
            const fullTailwindConfig = resolveConfig(config);
            const colors = fullTailwindConfig.theme.colors;
            const fontSizes = fullTailwindConfig.theme.fontSize;
            const fontWeights = fullTailwindConfig.theme.fontWeight;
            const fontFamilies = fullTailwindConfig.theme.fontFamily;
            return await getCsfFromConfig(
                colors,
                fontSizes,
                fontWeights,
                fontFamilies,
                true
            );
        },
    };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
