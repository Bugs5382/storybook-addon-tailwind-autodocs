import { getTypography, groupTailwindColors } from './core/util/helpers';
import csf from './core/theme-transformer/csf';
// TODO: Move into core?
export const generateCsf = (
    tailwindConfigColors: Record<string, any>,
    tailwindTypographyRecord: Record<string, any>
) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    const typography = getTypography(
        tailwindTypographyRecord.fontSizes,
        tailwindTypographyRecord.fontWeights,
        tailwindTypographyRecord.fontFamilies
    );
    return csf(groupedColors, typography);
};
