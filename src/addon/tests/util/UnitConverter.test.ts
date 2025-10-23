import { describe, it, expect } from 'vitest';
import { UnitConverter } from '../../util';

const validCases = [
    ['2rem', '32px'],
    ['1em', '16px'],
    ['10px', '10px'],
    ['3pt', '4px'],
    ['2cm', '75.5906px'],
    ['5mm', '18.8977px'],
    ['0.5in', '48px'],
    ['2pc', '32px'],
    ['50%', '8px'],
    ['+2rem', '32px'],
];

const invalidCases = [
    'abc',
    '',
    '16',
    '16unknown',
    'nanpx',
    'NaNrem',
    '1vw',
    '1vh',
    '1ex',
    '  ',
    '2 rem',
];

describe('UnitConverter', () => {
    const converter = new UnitConverter();

    describe.each(validCases)('valid input: %s', (input, expected) => {
        it(`converts "${input}" to "${expected}"`, () => {
            expect(converter.toPx(input)).toBe(expected);
        });
    });

    describe.each(invalidCases)('invalid input: %s', input => {
        it(`returns default error size for "${input}"`, () => {
            expect(converter.toPx(input)).toBe('12px');
        });
    });

    it('handles negative and positive values', () => {
        expect(converter.toPx('-2rem')).toBe('-32px');
        expect(converter.toPx('+2rem')).toBe('32px');
        expect(converter.toPx('-1cm')).toBe('-37.7953px');
    });

    it('rounds to 4 decimal places', () => {
        expect(converter.toPx('1mm')).toBe('3.7795px');
        expect(converter.toPx('1pt')).toBe('1.3333px');
    });

    it('handles zero values', () => {
        expect(converter.toPx('0px')).toBe('0px');
        expect(converter.toPx('0em')).toBe('0px');
    });

    it('uses custom baseRatio for rem, em, %', () => {
        const custom = new UnitConverter(24);
        expect(custom.toPx('1rem')).toBe('24px');
        expect(custom.toPx('2em')).toBe('48px');
        expect(custom.toPx('50%')).toBe('12px');
    });

    it('is pure and does not mutate input', () => {
        const input = '2rem';
        const result = converter.toPx(input);
        expect(input).toBe('2rem');
        expect(result).toBe('32px');
    });

    it('handles very large and small numbers', () => {
        expect(converter.toPx('1000000px')).toBe('1000000px');
        expect(converter.toPx('0.0001in')).toBe('0.0096px');
    });

    it('trims whitespace in input', () => {
        expect(converter.toPx(' 2rem')).toBe('32px');
        expect(converter.toPx('2rem ')).toBe('32px');
        expect(converter.toPx('   2rem   ')).toBe('32px');
    });

    it('returns error for space between number and unit', () => {
        expect(converter.toPx('2 rem')).toBe('12px');
    });
});
