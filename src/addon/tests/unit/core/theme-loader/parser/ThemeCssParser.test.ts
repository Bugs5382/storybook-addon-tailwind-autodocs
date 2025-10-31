import { describe, expect, it, vi } from 'vitest';
import { ThemeCssParser } from '../../../../../core/theme-loader/parsers';
import { Logger } from '../../../../../util';

describe('ThemeCssParser', () => {
    it('parses a simple @theme block', () => {
        const css = `
            @theme {
                --color-primary: #fff;
                --font-sans: Arial, sans-serif;
            }
        `;
        const expected = {
            color: { primary: '#fff' },
            font: { sans: ['Arial', 'sans-serif'] },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('parses multiple @theme blocks and overrides', () => {
        const css = `
            @theme { --color-primary: #fff; }
            @theme { --color-primary: #000; }
        `;
        const expected = {
            color: { primary: '#000' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('resolves referenced variables when using @theme inline', () => {
        const css = `
            @theme inline {
                --font-inter: 'Inter, sans-serif';
                --font-sans: var(--font-inter);
            }
        `;
        const expected = {
            font: {
                inter: ['Inter', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles global resets', () => {
        const css = `
            @theme {
                --*: initial;
                --color-blue: #00f;
            }
        `;
        const expected = {
            '*': { '*': 'initial' },
            color: { blue: '#00f' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles color namespace resets', () => {
        const css = `
            @theme {
                --color-*: initial;
                --color-blue: #00f;
            }
        `;
        const expected = {
            color: { '*': 'initial', blue: '#00f' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles font namespace resets', () => {
        const css = `
        @theme {
            --font-*: initial;
            --font-sans: Arial, sans-serif;
        }
    `;
        const expected = {
            font: { '*': 'initial', sans: ['Arial', 'sans-serif'] },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles font-weight namespace resets', () => {
        const css = `
        @theme {
            --font-weight-*: initial;
            --font-weight-bold: 700;
        }
    `;
        const expected = {
            'font-weight': { '*': 'initial', bold: '700' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles text namespace resets', () => {
        const css = `
        @theme {
            --text-*: initial;
            --text-lg: 1.125rem;
        }
    `;
        const expected = {
            text: { '*': 'initial', lg: '1.125rem' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('still parses nested @theme blocks', () => {
        const css = `
            .foo {
                @theme { --color-primary: #fff; }
            }
        `;
        const expected = {
            color: { primary: '#fff' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('parses a full @theme block with all major fields', () => {
        const css = `
            @theme {
                --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                --color-red-50: oklch(97.1% 0.013 17.38);
                --color-orange-100: oklch(95.4% 0.038 75.164);
                --color-emerald-500: oklch(69.6% 0.17 162.48);
                --color-black: #000;
                --color-white: #fff;
                --breakpoint-sm: 40rem;
                --breakpoint-xl: 80rem;
                --container-xs: 20rem;
                --container-2xl: 42rem;
                --text-xs: 0.75rem;
                --text-xs--line-height: calc(1 / 0.75);
                --text-4xl: 2.25rem;
                --font-weight-bold: 700;
                --font-weight-normal: 400;
                --radius-lg: 0.5rem;
                --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                --blur-xl: 24px;
                --perspective-distant: 1200px;
                --aspect-video: 16 / 9;
            }
        `;
        const expected = {
            font: {
                sans: [
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
                serif: [
                    'ui-serif',
                    'Georgia',
                    'Cambria',
                    'Times New Roman',
                    'Times',
                    'serif',
                ],
                mono: [
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace',
                ],
            },
            color: {
                'red-50': 'oklch(97.1% 0.013 17.38)',
                'orange-100': 'oklch(95.4% 0.038 75.164)',
                'emerald-500': 'oklch(69.6% 0.17 162.48)',
                black: '#000',
                white: '#fff',
            },
            breakpoint: {
                sm: '40rem',
                xl: '80rem',
            },
            container: {
                xs: '20rem',
                '2xl': '42rem',
            },
            text: {
                xs: '0.75rem',
                'xs--line-height': 'calc(1 / 0.75)',
                '4xl': '2.25rem',
            },
            'font-weight': {
                bold: '700',
                normal: '400',
            },
            radius: {
                lg: '0.5rem',
            },
            shadow: {
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            blur: {
                xl: '24px',
            },
            perspective: {
                distant: '1200px',
            },
            aspect: {
                video: '16 / 9',
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('parses a complex inline @theme block with references, resets, and multi-part namespaces', () => {
        const css = `
            @theme inline {
                --font-base: 'Roboto, "Open Sans", Arial, sans-serif';
                --font-sans: var(--font-base);
                --font-serif: 'Times New Roman', Times, serif;
                --font-mono: var(--font-serif);
                --color-accent: #abcdef;
                --color-*: initial;
                --color-primary: #123456;
                --color-secondary: var(--color-primary);
                --font-weight-bold: 700;
                --font-weight-normal: 400;
                --font-weight-light: var(--font-weight-normal);
                --text-lg: 1.125rem;
                --text-lg--line-height: calc(1.5);
                --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
                --radius-full: 9999px;
                --breakpoint-md: 48rem;
                --container-lg: 64rem;
                --aspect-square: 1 / 1;
                --font-custom: var(--font-base);
                --font-fancy: 'Caveat', cursive, var(--font-base);
            }
        `;
        const expected = {
            font: {
                base: ['Roboto', 'Open Sans', 'Arial', 'sans-serif'],
                sans: ['Roboto', 'Open Sans', 'Arial', 'sans-serif'],
                serif: ['Times New Roman', 'Times', 'serif'],
                mono: ['Times New Roman', 'Times', 'serif'],
                custom: ['Roboto', 'Open Sans', 'Arial', 'sans-serif'],
                fancy: [
                    'Caveat',
                    'cursive',
                    'Roboto',
                    'Open Sans',
                    'Arial',
                    'sans-serif',
                ],
            },
            color: {
                '*': 'initial',
                primary: '#123456',
                secondary: '#123456',
            },
            'font-weight': {
                bold: '700',
                normal: '400',
                light: '400',
            },
            text: {
                lg: '1.125rem',
                'lg--line-height': 'calc(1.5)',
            },
            shadow: {
                xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
            },
            radius: {
                full: '9999px',
            },
            breakpoint: {
                md: '48rem',
            },
            container: {
                lg: '64rem',
            },
            aspect: {
                square: '1 / 1',
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('logs error when max recursion depth is reached for font variable', () => {
        const css = `
            @theme inline {
                --font-loop: var(--font-loop);
            }
        `;
        const spy = vi.spyOn(Logger, 'error').mockImplementation(() => {});
        ThemeCssParser.parseTheme(css);
        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining('Maximum recursion depth')
        );
        spy.mockRestore();
    });

    it('ignores commented out variables', () => {
        const css = `
            @theme {
                /* --color-primary: #fff; */
                --color-secondary: #000; /* --color-tertiary: #123456; */
                /*
                  --font-sans: Arial, sans-serif;
                  --color-quaternary: #abcdef;
                */
                --font-serif: Times, serif;
            }
        `;
        const expected = {
            color: { secondary: '#000' },
            font: { serif: ['Times', 'serif'] },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles font namespace reset with initial and resolves font references inline', () => {
        const css = `
            @theme inline {
                --font-*: initial;
                --color-primary: red;
                --font-inter: "Courier New", sans-serif;
                --font-test: var(--font-inter);
            }
        `;
        const expected = {
            font: {
                '*': 'initial',
                test: ['Courier New', 'sans-serif'],
                inter: ['Courier New', 'sans-serif'],
            },
            color: {
                primary: 'red',
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('handles color namespace reset with initial and resolves color references inline', () => {
        const css = `
            @theme inline {
                --color-*: initial;
                --color-primary: red;
                --font-inter: "Courier New", sans-serif;
                --color-secondary: var(--color-primary);
            }
        `;
        const expected = {
            color: {
                '*': 'initial',
                primary: 'red',
                secondary: 'red',
            },
            font: {
                inter: ['Courier New', 'sans-serif'],
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('discards all previous variables after a global reset', () => {
        const css = `
        @theme {
            --color-primary: #fff;
            --font-sans: Arial, sans-serif;
            --*: initial;
            --color-secondary: #000;
        }
    `;
        const expected = {
            '*': { '*': 'initial' },
            color: { secondary: '#000' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('discards previous namespace variables after a namespace reset', () => {
        const css = `
        @theme {
            --font-sans: Arial, sans-serif;
            --font-*: initial;
            --font-serif: Times, serif;
        }
    `;
        const expected = {
            font: { '*': 'initial', serif: ['Times', 'serif'] },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('discards all previous variables after a global reset', () => {
        const css = `
        @theme {
            --color-primary: #fff;
            --font-sans: Arial, sans-serif;
            --*: initial;
            --color-secondary: #000;
        }
    `;
        const expected = {
            '*': { '*': 'initial' },
            color: { secondary: '#000' },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('does not resolve references to variables defined before a namespace reset', () => {
        const css = `
        @theme inline {
            --font-inter: Arial, sans-serif;
            --font-*: initial;
            --font-sans: var(--font-inter);
        }
    `;
        const expected = {
            font: {
                '*': 'initial',
                sans: ['var(--font-inter)'],
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });

    it('does not resolve references to color variables defined before a namespace reset', () => {
        const css = `
        @theme inline {
            --color-primary: #fff;
            --color-*: initial;
            --color-secondary: var(--color-primary);
        }
    `;
        const expected = {
            color: {
                '*': 'initial',
                secondary: 'var(--color-primary)',
            },
        };
        const parsedTheme = ThemeCssParser.parseTheme(css);
        expect(parsedTheme.variables).toStrictEqual(expected);
    });
});
