// src/addon/tests/unit/util/sanitizeExportName.test.ts
import { describe, expect, it } from 'vitest';
import { sanitizeExportName } from '../../../util/sanitizeExportName';

describe('sanitizeExportName', () => {
    it('handles single word', () => {
        expect(sanitizeExportName('colors')).toBe('Colors');
        expect(sanitizeExportName('COLORS')).toBe('Colors');
    });

    it('handles multiple words with single space', () => {
        expect(sanitizeExportName('My Theme')).toBe('MyTheme');
        expect(sanitizeExportName('design system')).toBe('DesignSystem');
    });

    it('handles multiple spaces between words', () => {
        expect(sanitizeExportName('My  Theme')).toBe('MyTheme');
        expect(sanitizeExportName('My    Theme')).toBe('MyTheme');
    });

    it('handles leading and trailing spaces', () => {
        expect(sanitizeExportName('  MyTheme  ')).toBe('Mytheme');
        expect(sanitizeExportName('  My Theme  ')).toBe('MyTheme');
    });

    it('handles three or more words', () => {
        expect(sanitizeExportName('My Design System')).toBe('MyDesignSystem');
        expect(sanitizeExportName('one two three four')).toBe(
            'OneTwoThreeFour'
        );
    });

    it('handles mixed case input', () => {
        expect(sanitizeExportName('mY tHeME')).toBe('MyTheme');
        expect(sanitizeExportName('DESIGN SYSTEM')).toBe('DesignSystem');
    });

    it('handles empty string', () => {
        expect(sanitizeExportName('')).toBe('');
    });

    it('handles only spaces', () => {
        expect(sanitizeExportName('   ')).toBe('');
    });

    it('removes special characters and joins words', () => {
        expect(sanitizeExportName('My-Theme')).toBe('MyTheme');
        expect(sanitizeExportName('My_Theme')).toBe('MyTheme');
        expect(sanitizeExportName('test/theme')).toBe('TestTheme');
        expect(sanitizeExportName('My_Theme!')).toBe('MyTheme');
        expect(sanitizeExportName('test/my theme')).toBe('TestMyTheme');
    });

    it('handles mixed symbols and spaces', () => {
        expect(sanitizeExportName('my-design system!')).toBe('MyDesignSystem');
        expect(sanitizeExportName('a/b/c d_e')).toBe('ABCDE');
    });
});
