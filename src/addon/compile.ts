import { getTypography, groupTailwindColors } from './helpers';
import colors from './csf/colors';

export const getCsfFromConfig = async (
    tailwindConfigColors: Record<string, any>,
    tailwindFontSizes: Record<string, any>,
    tailwindFontWeights: Record<string, any>,
    tailwindFontFamilies: Record<string, any>
) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    return colors(groupedColors);
    // TODO: Typography
    // TODO: Layouts (breakpoints, spacing, etc.)
};