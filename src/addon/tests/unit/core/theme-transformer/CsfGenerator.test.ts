import { describe, it, expect } from 'vitest';
import { CsfGenerator } from '../../../../core/theme-transformer/CsfGenerator';
import { Color } from '../../../../core/theme-transformer/Color';

describe('CsfGenerator', () => {
    it('renders fallback message when colors are empty', () => {
        const generator = new CsfGenerator();
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain(
            'No colors detected. To see a color, add it to your Tailwind configuration'
        );
    });

    it('renders ColorItem when colors are present', () => {
        const colors = [
            new Color('brandPrimary', { brandPrimary: '#ff0000' }),
            new Color('brandSecondary', { brandSecondary: '#0000ff' }),
        ];
        const generator = new CsfGenerator();
        const result = generator.generate(colors, {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain('ColorItem');
        expect(result).toContain('brandPrimary');
        expect(result).toContain('brandSecondary');
    });

    it('renders fallback message when typography is empty', () => {
        const generator = new CsfGenerator();
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain(
            'No font families detected. To see typography, add a font family to your Tailwind configuration,'
        );
    });

    it('renders font families when typography is present', () => {
        const generator = new CsfGenerator();
        const typography = {
            type: { sans: 'Helvetica, Arial', serif: 'Georgia, Times' },
            weight: { normal: '400', bold: '700' },
            size: { sm: '16px', lg: '32px' },
        };
        const result = generator.generate([], typography);
        expect(result).toContain('FontHeaderSection');
        expect(result).toContain('Helvetica, Arial');
        expect(result).toContain('Georgia, Times');
        expect(result).toContain('400');
        expect(result).toContain('700');
        expect(result).toContain('16px');
        expect(result).toContain('32px');
    });
});
