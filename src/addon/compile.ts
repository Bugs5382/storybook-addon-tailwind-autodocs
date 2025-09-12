import { getTypography, groupTailwindColors } from './helpers';
import colors from './csf/colors';
import { generateThemeMdx } from './mdx';
import { compile } from '@storybook/mdx2-csf';

export const getCsfFromConfig = async (
    tailwindConfigColors: Record<string, any>,
    tailwindFontSizes: Record<string, any>,
    tailwindFontWeights: Record<string, any>,
    tailwindFontFamilies: Record<string, any>,
    useMdx: boolean = false
) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    const typography = getTypography(
        tailwindFontSizes,
        tailwindFontWeights,
        tailwindFontFamilies
    );
    if (useMdx) {
        // TODO: Figure out if I need to finish this off, or leave as is (or remove?)
        // The problem here is that the generated CSF from our MDX has one export.
        // We need multiple exports in a single CSF to create multiple entries
        const themeMdx = generateThemeMdx(groupedColors, typography);
        return await compile(themeMdx, {});
    }
    return colors(groupedColors);
    // TODO: Typography
    // TODO: Layouts (breakpoints, spacing, etc.)
};