import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { mockRequireModule, restoreRequireModule } from '../mockRequireModule';
import { ThemePreparer } from '../../../../core/theme-transformer/ThemePreparer';

const MOCK_TAILWIND_COLORS = {
    red: {
        '100': 'oklch(93.6% 0.032 17.717)',
        '200': 'oklch(88.5% 0.062 18.334)',
        '300': 'oklch(80.8% 0.114 19.571)',
    },
    black: '#000',
    white: '#fff',
};

describe('ThemePreparer', () => {
    let preparer: ThemePreparer;
    let mockToPx: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockToPx = vi.fn().mockImplementation(size => {
            // Mock here is just (rem value) * 16 = (px val)
            if (size === '0.875rem') return '14px';
            if (size === '1.125rem') return '18px';
            if (size === '2rem') return '32px';
            if (size === '5rem') return '80px';
            if (size === '1rem') return '16px';
        });
        const mockUnitConverter = { toPx: mockToPx };
        preparer = new ThemePreparer(mockUnitConverter as any);
        mockRequireModule('tailwindcss/colors', MOCK_TAILWIND_COLORS);
    });

    afterAll(() => {
        restoreRequireModule();
    });

    describe('prepareColorsForCsf', () => {
        it('returns empty array for empty input', () => {
            expect(preparer.prepareColorsForCsf({})).toEqual([]);
        });

        it('returns empty array for null or undefined', () => {
            expect(preparer.prepareColorsForCsf(null)).toEqual([]);
            expect(preparer.prepareColorsForCsf(undefined)).toEqual([]);
        });

        it('prepares colors where all values are strings', () => {
            const colors = {
                brandPrimary: '#ff0000',
                brandSecondary: '#0000ff',
            };
            const result = preparer.prepareColorsForCsf(colors);
            expect(
                result.map(c => ({
                    baseName: c.baseName,
                    shades: c.shades,
                }))
            ).toEqual([
                {
                    baseName: 'brandPrimary',
                    shades: { brandPrimary: '#ff0000' },
                },
                {
                    baseName: 'brandSecondary',
                    shades: { brandSecondary: '#0000ff' },
                },
            ]);
        });

        it('prepares colors where some values are objects', () => {
            const colors = {
                brandPrimary: { 500: '#ff0000' },
                brandSecondary: '#0000ff',
            };
            const result = preparer.prepareColorsForCsf(colors);
            expect(
                result.map(c => ({
                    baseName: c.baseName,
                    shades: c.shades,
                }))
            ).toEqual([
                {
                    baseName: 'brandPrimary',
                    shades: { 500: '#ff0000' },
                },
                {
                    baseName: 'brandSecondary',
                    shades: { brandSecondary: '#0000ff' },
                },
            ]);
        });

        it('prepares colors with a mix of strings and objects', () => {
            const colors = {
                brandPrimary: { 500: '#ff0000', 400: '#ff3e49' },
                brandSecondary: '#0000ff',
                accentColor: { 300: '#00ff00' },
            };
            const result = preparer.prepareColorsForCsf(colors);
            expect(
                result.map(c => ({
                    baseName: c.baseName,
                    shades: c.shades,
                }))
            ).toEqual([
                {
                    baseName: 'brandPrimary',
                    shades: { 500: '#ff0000', 400: '#ff3e49' },
                },
                {
                    baseName: 'brandSecondary',
                    shades: { brandSecondary: '#0000ff' },
                },
                {
                    baseName: 'accentColor',
                    shades: { 300: '#00ff00' },
                },
            ]);
        });
    });

    describe('prepareTypographyForCsf', () => {
        it('converts font sizes with array and string values', () => {
            const fontSizes = {
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                lg: '1.125rem',
            };
            const result = preparer.prepareTypographyForCsf(fontSizes, {}, {});
            expect(result.size).toEqual({ sm: '14px', lg: '18px' });
        });

        it('handles font sizes with only string values', () => {
            const fontSizes = { md: '2rem' };
            const result = preparer.prepareTypographyForCsf(fontSizes, {}, {});
            expect(result.size).toEqual({ md: '32px' });
        });

        it('returns empty size object for empty fontSizes', () => {
            const result = preparer.prepareTypographyForCsf({}, {}, {});
            expect(result.size).toEqual({});
        });

        it('sorts font sizes by pixel value ascending', () => {
            const fontSizes = {
                lg: '2rem', // 32px
                sm: '1rem', // 16px
                xxs: '5rem', // 80px
            };
            const result = preparer.prepareTypographyForCsf(fontSizes, {}, {});
            expect(Object.keys(result.size)).toEqual(['sm', 'lg', 'xxs']); // 16px, 32px, 80px
            expect(result.size).toEqual({
                sm: '16px',
                lg: '32px',
                xxs: '80px',
            });
        });

        it('passes font weights through unchanged', () => {
            const fontWeights = { normal: '400', bold: '700', light: '300' };
            const result = preparer.prepareTypographyForCsf(
                {},
                fontWeights,
                {}
            );
            expect(result.weight).toEqual(fontWeights);
        });

        it('returns empty weight object for empty fontWeights', () => {
            const result = preparer.prepareTypographyForCsf({}, {}, {});
            expect(result.weight).toEqual({});
        });

        it('joins font families with multiple values', () => {
            const fontFamilies = {
                sans: ['Helvetica', 'Arial'],
                serif: ['Georgia', 'Times'],
            };
            const result = preparer.prepareTypographyForCsf(
                {},
                {},
                fontFamilies
            );
            expect(result.type).toEqual({
                sans: 'Helvetica, Arial',
                serif: 'Georgia, Times',
            });
        });

        it('joins font families with single value', () => {
            const fontFamilies = { mono: ['Menlo'] };
            const result = preparer.prepareTypographyForCsf(
                {},
                {},
                fontFamilies
            );
            expect(result.type).toEqual({ mono: 'Menlo' });
        });

        it('handles empty font family arrays', () => {
            const fontFamilies: Record<string, string[]> = {
                sans: [],
                serif: [],
            };
            const result = preparer.prepareTypographyForCsf(
                {},
                {},
                fontFamilies
            );
            expect(result.type).toEqual({ sans: '', serif: '' });
        });

        it('handles font family names with spaces', () => {
            const fontFamilies = {
                sans: ['Helvetica Neue', 'Arial Black'],
                serif: ['Times New Roman', 'Courier New'],
            };
            const result = preparer.prepareTypographyForCsf(
                {},
                {},
                fontFamilies
            );
            expect(result.type).toEqual({
                sans: 'Helvetica Neue, Arial Black',
                serif: 'Times New Roman, Courier New',
            });
        });

        it('handles all fields together', () => {
            const fontSizes = {
                sm: '1rem',
                lg: ['2rem', { lineHeight: '2.5rem' }],
            };
            const fontWeights = { normal: '400', bold: '700' };
            const fontFamilies = {
                fancy: ['Caveat'],
                sans: ['Arial', 'sans-serif'],
            };
            const result = preparer.prepareTypographyForCsf(
                fontSizes,
                fontWeights,
                fontFamilies
            );
            expect(result.size).toEqual({ sm: '16px', lg: '32px' });
            expect(result.weight).toEqual(fontWeights);
            expect(result.type).toEqual({
                fancy: 'Caveat',
                sans: 'Arial, sans-serif',
            });
        });
    });
});
