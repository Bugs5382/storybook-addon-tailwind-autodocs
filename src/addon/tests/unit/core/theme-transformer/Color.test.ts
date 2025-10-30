import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mockRequireModule, restoreRequireModule } from '../mockRequireModule';
import { Color } from '../../../../core/theme-transformer/Color';

const v4TailwindColorsMock = {
    red: {
        '50': 'oklch(97.1% 0.013 17.38)',
        '100': 'oklch(93.6% 0.032 17.717)',
        '200': 'oklch(88.5% 0.062 18.334)',
        '300': 'oklch(80.8% 0.114 19.571)',
        '400': 'oklch(70.4% 0.191 22.216)',
        '500': 'oklch(63.7% 0.237 25.331)',
        '600': 'oklch(57.7% 0.245 27.325)',
        '700': 'oklch(50.5% 0.213 27.518)',
        '800': 'oklch(44.4% 0.177 26.899)',
        '900': 'oklch(39.6% 0.141 25.723)',
        '950': 'oklch(25.8% 0.092 26.042)',
    },
    white: '#fff',
};
const v3TailwindColorsMock = {
    red: {
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
    },
    white: '#fff',
};

describe('Color subtitle logic', () => {
    describe('V4', () => {
        beforeAll(() => {
            mockRequireModule('tailwindcss/colors', v4TailwindColorsMock);
        });

        afterAll(() => {
            restoreRequireModule();
        });
        it('sets subtitle for default Tailwind color', () => {
            const shades = { ...v4TailwindColorsMock.red };
            const color = new Color('red', shades);
            expect(color.subtitle).toBe('Default color from TailwindCSS');
        });

        it('sets subtitle for extended Tailwind color', () => {
            const extendedShades = {
                ...v4TailwindColorsMock.red,
                extra: '#fff',
            };
            const color = new Color('red', extendedShades);
            expect(color.subtitle).toBe('Extended from default Tailwind color');
        });

        it('sets subtitle for custom color (baseName not in Tailwind)', () => {
            const color = new Color('custom', { '500': '#123456' });
            expect(color.subtitle).toBe('Custom color');
        });

        it('sets subtitle for custom color (shades do not match, but baseName is in Tailwind)', () => {
            const color = new Color('red', { '500': '#123456' });
            expect(color.subtitle).toBe('Custom color');
        });

        it('sets subtitle for simple color (white)', () => {
            const color = new Color('white', { white: '#fff' });
            expect(color.subtitle).toBe('Default color from TailwindCSS');
        });
    });
    describe('V3', () => {
        beforeAll(() => {
            mockRequireModule('tailwindcss/colors', v3TailwindColorsMock);
        });

        afterAll(() => {
            restoreRequireModule();
        });

        it('sets subtitle for default Tailwind color', () => {
            const shades = { ...v3TailwindColorsMock.red };
            const color = new Color('red', shades);
            expect(color.subtitle).toBe('Default color from TailwindCSS');
        });

        it('sets subtitle for extended Tailwind color', () => {
            const extendedShades = {
                ...v3TailwindColorsMock.red,
                extra: '#fff',
            };
            const color = new Color('red', extendedShades);
            expect(color.subtitle).toBe('Extended from default Tailwind color');
        });

        it('sets subtitle for custom color (baseName not in Tailwind)', () => {
            const color = new Color('custom', { '500': '#123456' });
            expect(color.subtitle).toBe('Custom color');
        });

        it('sets subtitle for custom color (shades do not match, but baseName is in Tailwind)', () => {
            const color = new Color('red', { '500': '#123456' });
            expect(color.subtitle).toBe('Custom color');
        });

        it('sets subtitle for simple color (white)', () => {
            const color = new Color('white', { white: '#fff' });
            expect(color.subtitle).toBe('Default color from TailwindCSS');
        });
    });
});
