import { ResolvedConfig, Typography } from '../../types';
import csf from './csf';
import allColors from 'tailwindcss/colors';
import { UnitConverter } from '../../util';

export class ThemeTransformer {
    private readonly unitConverter: UnitConverter;

    constructor(unitConverter?: UnitConverter) {
        this.unitConverter = unitConverter || new UnitConverter();
    }

    transformToCsf(config: ResolvedConfig) {
        const colors = config.theme.colors;
        const twTypography = {
            fontSizes: config.theme.fontSize,
            fontWeights: config.theme.fontWeight,
            fontFamilies: config.theme.fontFamily,
        };

        const groupedColors = this.groupColors(colors);
        const typography = this.getTypography(
            twTypography.fontSizes,
            twTypography.fontWeights,
            twTypography.fontFamilies
        );
        return csf(groupedColors, typography);
    }

    private groupColors(colors: Record<string, any>) {
        const groupedColors: Record<string, Record<string, string>> = {};
        for (const key in colors) {
            const value = colors[key];
            if (typeof value === 'object') {
                groupedColors[key] = value;
            } else {
                groupedColors[key] = { [key]: value };
            }
        }
        return Object.entries(groupedColors).map(([key, value]) => ({
            key,
            value,
            subtitle: this.getColorSubtitle(key),
        }));
    }

    private getColorSubtitle(colorLabel: string): string {
        return allColors.hasOwnProperty(colorLabel)
            ? 'Default color from Tailwind CSS'
            : 'Custom color';
    }

    private getTypography(
        fontSizes: Record<string, any>,
        fontWeights: Record<string, any>,
        fontFamilies: Record<string, any>
    ): Typography {
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
