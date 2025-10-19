import { ResolvedConfig, Typography } from '../../types';
import csf from './csf';
import allColors from 'tailwindcss/colors';

// TODO: Add support for other units (or use library which already does this)
const TAILWIND_BASE_RATIO = 16;
const unitConversionRatios: Record<string, number> = {
    rem: TAILWIND_BASE_RATIO,
    em: TAILWIND_BASE_RATIO,
    px: 1,
    pt: 1.33333, // 1pt = 1.33333px
    cm: 37.7953, // 1cm = 37.7953px
    mm: 3.77953, // 1mm = 3.77953px
    in: 96, // 1in = 96px
    pc: 16, // 1pc = 16px
    '%': 0.16, // Assuming 1% of 16px base font size
};

export class ThemeTransformer {
    // TODO: Make param theme?
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
        return csf(groupedColors, typography); // TODO: Why doesn't this work if its not jsx?
    }

    private groupColors = (colors: Record<string, any>) => {
        const groupedColors: Record<string, Record<string, string>> = {};
        for (const key in colors) {
            const value = colors[key];
            if (typeof value === 'object') {
                groupedColors[key] = value;
            } else {
                groupedColors[key] = { [key]: value };
            }
        }
        // Transform into an array of objects with key, value, and subtitle
        return Object.entries(groupedColors).map(([key, value]) => ({
            key,
            value,
            subtitle: this.getSubtitle(key, value),
        }));
    };

    private getTypography = (
        fontSizes: Record<string, any>,
        fontWeights: Record<string, any>,
        fontFamilies: Record<string, any>
    ): Typography => {
        const extractedFontSizes = this.extractFontSizes(fontSizes);
        const fontFamilyStrings = this.getFontFamiliesAsStrings(fontFamilies);
        return {
            type: fontFamilyStrings,
            weight: fontWeights,
            size: extractedFontSizes,
        };
    };

    private extractFontSizes = (
        fontSizes: Record<string, any>
    ): Record<string, string> => {
        const extractedFontSizes: Record<string, string> = {};
        for (const key in fontSizes) {
            if (Array.isArray(fontSizes[key])) {
                extractedFontSizes[key] = this.getPxValue(fontSizes[key][0]);
            } else {
                extractedFontSizes[key] = this.getPxValue(fontSizes[key]);
            }
        }

        // Sort the extracted font sizes by their pixel values
        const sortedFontSizes = Object.entries(extractedFontSizes).sort(
            ([, sizeA], [, sizeB]) => parseFloat(sizeA) - parseFloat(sizeB)
        );

        // Convert back to an object
        const sortedFontSizesObj: Record<string, string> = {};
        for (const [key, value] of sortedFontSizes) {
            sortedFontSizesObj[key] = value;
        }

        return sortedFontSizesObj;
    };

    // TODO: Probably move to something more generic
    private getPxValue = (size: string): string => {
        const unitMatch = size.match(/[\d.]+(\D+)$/);
        if (!unitMatch) {
            throw new Error(`Invalid size format: ${size}`);
        }

        const value = parseFloat(size);
        const unit = unitMatch[1];

        if (!unitConversionRatios[unit]) {
            throw new Error(`Unsupported unit: ${unit}`);
        }

        const pxValue = value * unitConversionRatios[unit];
        const roundedPxValue = parseFloat(pxValue.toFixed(4));
        return `${roundedPxValue}px`;
    };

    private getFontFamiliesAsStrings = (
        fontFamilies: Record<string, string[]>
    ): Record<string, string> => {
        const fontFamiliesAsStrings: Record<string, string> = {};
        for (const key in fontFamilies) {
            fontFamiliesAsStrings[key] = fontFamilies[key].join(', ');
        }
        return fontFamiliesAsStrings;
    };

    // TODO: Add ability to turn this off based off user input
    private getSubtitle = (
        colorLabel: string,
        values: Record<string, string>
    ): string => {
        const defaultColorMessage = 'Default color from Tailwind CSS';
        const customColorMessage = 'Custom color';

        if (!allColors.hasOwnProperty(colorLabel)) {
            return customColorMessage;
        }

        return defaultColorMessage;
    };
}
