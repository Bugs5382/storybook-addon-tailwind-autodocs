import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { CssLoader } from '../../../../../core/theme-loader/loaders';
import {
    mockRequireModule,
    restoreRequireModule,
} from '../../mockRequireModule';
import { ParsedTheme } from '../../../../../core/theme-loader/parsers';
import { VIRTUAL_FILE_PREFIX } from '../../../../../constants';

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
}));

const mockReadFileSync = vi.mocked(readFileSync);

describe('CssLoader', () => {
    describe('getTailwindTheme', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockRequireModule('tailwindcss/defaultTheme', {
                colors: { gray: { 100: '#eee' }, black: '#000', white: '#fff' },
                fontSize: { sm: ['0.875rem', { lineHeight: '1.25rem' }] },
                fontFamily: { mono: ['Menlo', 'monospace'] },
                fontWeight: { normal: '400' },
            });
        });

        afterEach(() => {
            restoreRequireModule();
        });

        it('parses CSS theme file and maps variables to Tailwind config', async () => {
            const css = `
          @theme {
            --color-primary-100: #f00;
            --color-primary-200: #c00;
            --font-sans: Arial, sans-serif;
            --font-weight-bold: 700;
            --text-lg: 1.125rem;
          }
        `;
            mockReadFileSync.mockReturnValue(css);

            // Mock ThemeCssParser
            const mockParser = {
                parseTheme: vi.fn().mockReturnValue(
                    new ParsedTheme({
                        color: {
                            'primary-100': '#f00',
                            'primary-200': '#c00',
                        },
                        font: {
                            sans: ['Arial', 'sans-serif'],
                        },
                        'font-weight': {
                            bold: '700',
                        },
                        text: {
                            lg: '1.125rem',
                        },
                    })
                ),
            };

            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme.colors.primary['100']).toBe('#f00');
            expect(result.theme.colors.primary['200']).toBe('#c00');
            expect(result.theme.colors.gray['100']).toBe('#eee');
            expect(result.theme.colors.black).toBe('#000');
            expect(result.theme.colors.white).toBe('#fff');
            expect(result.theme.fontFamily.sans).toEqual([
                'Arial',
                'sans-serif',
            ]);
            expect(result.theme.fontFamily.mono).toEqual([
                'Menlo',
                'monospace',
            ]);
            expect(result.theme.fontWeight.bold).toBe('700');
            expect(result.theme.fontWeight.normal).toBe('400');
            expect(result.theme.fontSize.lg).toBe('1.125rem');
            expect(result.theme.fontSize.sm).toEqual([
                '0.875rem',
                { lineHeight: '1.25rem' },
            ]);
        });
    });
    describe('resolveId', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });
        it('returns virtual file path if @import tailwindcss is present', () => {
            mockReadFileSync.mockReturnValue('@import "tailwindcss";');
            const loader = new CssLoader();
            const result = loader.resolveId('styles.css');
            expect(result).toBe(VIRTUAL_FILE_PREFIX + 'styles.css.js');
        });
        it('returns null if @import tailwindcss is not present', () => {
            mockReadFileSync.mockReturnValue('body { color: red; }');
            const loader = new CssLoader();
            const result = loader.resolveId('styles.css');
            console.log(result);
            expect(result).toBeNull();
        });
    });
});
