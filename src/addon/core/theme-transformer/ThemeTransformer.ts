import { ResolvedConfig } from '../../types';
import { generateCsf } from '../../compile';
import { getTypography, groupTailwindColors } from '../util/helpers';
import csf from './csf';

export class ThemeTransformer {
    // TODO: Make param theme?
    transformToCsf(config: ResolvedConfig) {
        const colors = config.theme.colors;
        const twTypography = {
            fontSizes: config.theme.fontSize,
            fontWeights: config.theme.fontWeight,
            fontFamilies: config.theme.fontFamily,
        };

        const groupedColors = groupTailwindColors(colors);
        const typography = getTypography(
            twTypography.fontSizes,
            twTypography.fontWeights,
            twTypography.fontFamilies
        );
        return csf(groupedColors, typography); // TODO: Why doesn't this work if its not jsx?
    }
}
