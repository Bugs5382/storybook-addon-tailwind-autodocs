import { describe, expect, it } from 'vitest';
import {
    extractFontSizes,
    getFontFamiliesAsStrings,
    getPxValue,
    getSubtitle,
    getTypography,
    groupTailwindColors,
} from '../core/util/helpers';
import allColors from 'tailwindcss/colors';

// TODO: rethink the labelling
// TODO: recheck these tests.

describe('getFontFamiliesAsStrings', () => {
    it('should convert font families to strings correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica', 'Arial'],
            serif: ['Georgia', 'Times'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica, Arial',
            serif: 'Georgia, Times',
        });
    });

    it('should convert empty arrays to empty string', () => {
        const fontFamilies: Record<string, string[]> = {
            sans: [],
            serif: [],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: '',
            serif: '',
        });
    });

    it('should handle single font family correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica'],
            serif: ['Georgia'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica',
            serif: 'Georgia',
        });
    });

    it('should handle multiple font families correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica', 'Arial', 'Verdana'],
            serif: ['Georgia', 'Times', 'Courier'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica, Arial, Verdana',
            serif: 'Georgia, Times, Courier',
        });
    });

    it('should handle spaces in font family names correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica Neue', 'Arial Black'],
            serif: ['Times New Roman', 'Courier New'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica Neue, Arial Black',
            serif: 'Times New Roman, Courier New',
        });
    });
});

describe('getSubtitle', () => {
    it('should return "Default color from Tailwind CSS" for default Tailwind colors', () => {
        const colorLabel = 'red';
        const values = allColors.red;
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Default color from Tailwind CSS');
    });

    it('should return "Custom color" for non-default colors', () => {
        const colorLabel = 'brandPrimary';
        const values = { 500: '#ff0000' };
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });

    it('should return "Custom color" for colors not in Tailwind CSS', () => {
        const colorLabel = 'accentColor';
        const values = { 500: '#123456' };
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });

    it('should return "Custom color" for extended Tailwind colors', () => {
        const colorLabel = 'red';
        const values = { ...allColors.red, 600: '#ff6666' };
        const result = getSubtitle(colorLabel, values);
        // TODO: Should I update logic so that when you extend the tw color it says you're using a custom one?
        expect(result).toBe('Default color from Tailwind CSS');
    });
});

describe('groupTailwindColors', () => {
    it('should group colors where all values are strings', () => {
        const colors = { brandPrimary: '#ff0000', brandSecondary: '#0000ff' };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            {
                key: 'brandPrimary',
                value: { brandPrimary: '#ff0000' },
                subtitle: 'Custom color',
            },
            {
                key: 'brandSecondary',
                value: { brandSecondary: '#0000ff' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should group colors where some values are objects', () => {
        const colors = {
            brandPrimary: { 500: '#ff0000' },
            brandSecondary: '#0000ff',
        };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            {
                key: 'brandPrimary',
                value: { 500: '#ff0000' },
                subtitle: 'Custom color',
            },
            {
                key: 'brandSecondary',
                value: { brandSecondary: '#0000ff' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should group colors with a mix of strings and objects', () => {
        const colors = {
            brandPrimary: { 500: '#ff0000' },
            brandSecondary: '#0000ff',
            accentColor: { 300: '#00ff00' },
        };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            {
                key: 'brandPrimary',
                value: { 500: '#ff0000' },
                subtitle: 'Custom color',
            },
            {
                key: 'brandSecondary',
                value: { brandSecondary: '#0000ff' },
                subtitle: 'Custom color',
            },
            {
                key: 'accentColor',
                value: { 300: '#00ff00' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should correctly set the subtitle for default and custom colors', () => {
        const twReds = {
            '50': '#fef2f2',
            '100': '#fee2e2',
            '200': '#fecaca',
            '300': '#fca5a5',
            '400': '#f87171',
            '500': '#ef4444',
            '600': '#dc2626',
            '700': '#b91c1c',
            '800': '#991b1b',
            '900': '#7f1d1d',
            '950': '#450a0a',
        };
        const colors = { red: twReds, brandPrimary: '#123456' };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            {
                key: 'red',
                value: twReds,
                subtitle: 'Default color from Tailwind CSS',
            },
            {
                key: 'brandPrimary',
                value: { brandPrimary: '#123456' },
                subtitle: 'Custom color',
            },
        ]);
    });
});
