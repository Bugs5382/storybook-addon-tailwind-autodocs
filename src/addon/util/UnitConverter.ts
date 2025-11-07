import { SupportedFontUnit } from '../types';

export class UnitConverter {
    private readonly conversionRatios: ReadonlyMap<SupportedFontUnit, number>;
    private static readonly defaultErrorSize = '12px';
    private static readonly sizeRegex = /^([+-]?[\d.]+)([a-z%]+)$/i;

    constructor(baseRatio: number = 16) {
        this.conversionRatios = new Map<SupportedFontUnit, number>([
            ['rem', baseRatio],
            ['em', baseRatio],
            ['px', 1],
            ['pt', 4 / 3], // 1pt = 4/3px
            ['cm', 37.7953], // 1cm = 37.7953px
            ['mm', 3.77953], // 1mm = 3.77953px
            ['in', 96], // 1in = 96px
            ['pc', 16], // 1pc = 16px
            ['%', baseRatio * 0.01], // Assuming 1% of 16px base font size
        ]);
    }

    /**
     * Converts a CSS size string to px.
     * @param size CSS size string (e.g. '2rem', '10px')
     * @returns px value as string (e.g. '32px'), or default error size if invalid
     */
    toPx(size: string): string {
        const normalized = size.trim();
        const match = UnitConverter.sizeRegex.exec(normalized);
        if (!match) return UnitConverter.defaultErrorSize;

        const [, valueStr, unit] = match;
        const value = parseFloat(valueStr);
        if (isNaN(value)) return UnitConverter.defaultErrorSize;

        const ratio = this.conversionRatios.get(unit as SupportedFontUnit);
        if (ratio === undefined) return UnitConverter.defaultErrorSize;

        const pxValue = value * ratio;
        return `${Math.round(pxValue * 10000) / 10000}px`;
    }
}
