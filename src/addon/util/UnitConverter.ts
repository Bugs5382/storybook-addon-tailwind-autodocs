export class UnitConverter {
    private readonly baseRatio: number;
    private readonly conversionRatios: ReadonlyMap<string, number>;

    constructor(baseRatio: number = 16) {
        this.baseRatio = baseRatio;
        // TODO: Add support for other units (or use library which already does this)
        this.conversionRatios = new Map([
            ['rem', baseRatio],
            ['em', baseRatio],
            ['px', 1],
            ['pt', 4 / 3], // 1pt = 4/3px
            ['cm', 37.7953], // 1cm = 37.7953px
            ['mm', 3.77953], // 1mm = 3.77953px
            ['in', 96], // 1in = 96px
            ['pc', 16], // 1pc = 16px
            ['%', baseRatio * 0.16], // Assuming 1% of 16px base font size
        ]);
    }

    toPx(size: string): string {
        const defaultErrorSize = '12px';
        const match = size.match(/^(-?[\d.]+)([a-z%]+)$/i);
        if (!match) {
            return defaultErrorSize; // Return original if not a size value
        }

        const [, valueStr, unit] = match;
        const value = parseFloat(valueStr);

        if (isNaN(value)) {
            return defaultErrorSize;
        }

        const ratio = this.conversionRatios.get(unit);
        if (ratio === undefined) {
            return defaultErrorSize; // Return original for unsupported units
        }

        const pxValue = value * ratio;
        return `${Math.round(pxValue * 10000) / 10000}px`;
    }
}
