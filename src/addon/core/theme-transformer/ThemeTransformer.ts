import { ResolvedConfig, Typography } from '../../types';
import csf from './csf';
import { UnitConverter } from '../../util';
import { Color } from './Color';

export class ThemeTransformer {
    private readonly unitConverter: UnitConverter;

    public constructor(unitConverter?: UnitConverter) {
        this.unitConverter = unitConverter || new UnitConverter();
    }

    public transformToCsf(config: ResolvedConfig): string {
        const groupedColors = this.groupColors(config.theme.colors);
        const typography = this.getTypography(
            config.theme.fontSize,
            config.theme.fontWeight,
            config.theme.fontFamily
        );
        // console.log(typography);
        return csf(groupedColors, typography);
    }

    private groupColors(colors: Record<string, any>): Color[] {
        const groupedColors: Record<string, Record<string, string>> = {};
        for (const key in colors) {
            const values = colors[key];
            if (typeof values === 'object') {
                groupedColors[key] = values;
            } else {
                // if it's a string, just pair it as object with color name to string
                groupedColors[key] = { [key]: values };
            }
        }
        return Object.entries(groupedColors).map(
            ([key, value]) => new Color(key, value)
        );
    }

    private getTypography(
        fontSizes: Record<string, any>,
        fontWeights: Record<string, any>,
        fontFamilies: Record<string, any>
    ): Typography {
        // TODO: Improve this method + write tests for below
        const extractedFontSizes = this.extractFontSizes(fontSizes);
        const fontFamilyStrings = this.getFontFamiliesAsStrings(fontFamilies);
        return {
            type: fontFamilyStrings,
            weight: fontWeights,
            size: extractedFontSizes,
        };
    }

    private getFontFamiliesAsStrings(
        fontFamilies: Record<string, string[]>
    ): Record<string, string> {
        return Object.fromEntries(
            Object.entries(fontFamilies).map(([key, value]) => [
                key,
                value.join(', '),
            ])
        );
    }

    private extractFontSizes(
        fontSizes: Record<string, any>
    ): Record<string, string> {
        const extractedFontSizes: Record<string, string> = {};
        for (const key in fontSizes) {
            const fontSize = Array.isArray(fontSizes[key])
                ? fontSizes[key][0]
                : fontSizes[key];
            extractedFontSizes[key] = this.unitConverter.toPx(fontSize);
        }

        // Return sorted
        return Object.fromEntries(
            Object.entries(extractedFontSizes).sort(
                ([, sizeA], [, sizeB]) => parseFloat(sizeA) - parseFloat(sizeB)
            )
        );
    }
}
