import { describe, expect, it, vi } from 'vitest';
import { ThemeCssParser } from '../../../../core/theme-loader/parsers/ThemeCssParser';
import { Logger } from '../../../../util';

describe('ThemeCssParser', () => {
    it('parses a simple @theme block', () => {
        const css = `
      @theme {
        --color-primary: #fff;
        --font-sans: Arial, sans-serif;
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.variables.color.primary).toBe('#fff');
        expect(result.variables.font.sans).toEqual(['Arial', 'sans-serif']);
    });

    it('parses multiple @theme blocks and overrides', () => {
        const css = `
      @theme { --color-primary: #fff; }
      @theme { --color-primary: #000; }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.variables.color.primary).toBe('#000');
    });

    it('handles @theme inline and static options', () => {
        const css = `
      @theme inline {
        --font-inter: 'Inter, sans-serif';
      }
      @theme static {
        --color-accent: #123456;
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.options.inline).toBeUndefined();
        expect(result.options.static).toBe(true);
    });

    it('resolves referenced variables when using @theme inline', () => {
        const css = `
      @theme inline {
        --font-inter: 'Inter, sans-serif';
        --font-sans: var(--font-inter);
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        // font-sans should resolve to the value of font-inter, not just 'var(--font-inter)'
        expect(result.variables.font.inter).toEqual(['Inter', 'sans-serif']);
        expect(result.variables.font.sans).toEqual(['Inter', 'sans-serif']);
    });

    it('handles namespace resets', () => {
        const css = `
      @theme {
        --color-*: initial;
        --color-blue: #00f;
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.variables.color['*']).toBe('initial');
        expect(result.variables.color.blue).toBe('#00f');
    });

    it('still parses nested @theme blocks', () => {
        const css = `
      .foo {
        @theme { --color-primary: #fff; }
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.variables.color.primary).toBe('#fff');
    });

    it('is robust to malformed @theme blocks', () => {
        const css = `
      @theme {
        --color-primary #fff
        --font-sans: Arial, sans-serif;
      }
    `;
        const result = ThemeCssParser.parseTheme(css);
        expect(result.variables.color?.primary).toBeUndefined();
        expect(result.variables.font.sans).toEqual(['Arial', 'sans-serif']);
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
        const result = ThemeCssParser.parseTheme(css);

        // Font families
        expect(result.variables.font.sans).toEqual([
            'ui-sans-serif',
            'system-ui',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji',
        ]);
        expect(result.variables.font.serif).toEqual([
            'ui-serif',
            'Georgia',
            'Cambria',
            'Times New Roman',
            'Times',
            'serif',
        ]);
        expect(result.variables.font.mono).toEqual([
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'Liberation Mono',
            'Courier New',
            'monospace',
        ]);

        // Colors
        expect(result.variables.color['red-50']).toBe(
            'oklch(97.1% 0.013 17.38)'
        );
        expect(result.variables.color['orange-100']).toBe(
            'oklch(95.4% 0.038 75.164)'
        );
        expect(result.variables.color['emerald-500']).toBe(
            'oklch(69.6% 0.17 162.48)'
        );
        expect(result.variables.color.black).toBe('#000');
        expect(result.variables.color.white).toBe('#fff');

        // Breakpoints
        expect(result.variables.breakpoint.sm).toBe('40rem');
        expect(result.variables.breakpoint.xl).toBe('80rem');

        // Containers
        expect(result.variables.container.xs).toBe('20rem');
        expect(result.variables.container['2xl']).toBe('42rem');

        // Text sizes and line heights
        expect(result.variables.text.xs).toBe('0.75rem');
        expect(result.variables.text['xs--line-height']).toBe('calc(1 / 0.75)');
        expect(result.variables.text['4xl']).toBe('2.25rem');

        // Font weights
        expect(result.variables['font-weight'].bold).toBe('700');
        expect(result.variables['font-weight'].normal).toBe('400');

        // Radius
        expect(result.variables.radius.lg).toBe('0.5rem');

        // Shadows
        expect(result.variables.shadow.md).toBe(
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        );

        // Blur
        expect(result.variables.blur.xl).toBe('24px');

        // Perspective
        expect(result.variables.perspective.distant).toBe('1200px');

        // Aspect
        expect(result.variables.aspect.video).toBe('16 / 9');
    });

    // src/addon/tests/core/theme-loader/parser/ThemeCssParser.test.ts
    it('parses a complex inline @theme block with references, resets, and multi-part namespaces', () => {
        const css = `
      @theme inline {
        --font-base: 'Roboto, "Open Sans", Arial, sans-serif';
        --font-sans: var(--font-base);
        --font-serif: 'Times New Roman', Times, serif;
        --font-mono: var(--font-serif);
        --color-primary: #123456;
        --color-secondary: var(--color-primary);
        --color-accent: #abcdef;
        --color-*: initial;
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
        const result = ThemeCssParser.parseTheme(css);

        // Font families
        expect(result.variables.font.base).toEqual([
            'Roboto',
            'Open Sans',
            'Arial',
            'sans-serif',
        ]);
        expect(result.variables.font.sans).toEqual([
            'Roboto',
            'Open Sans',
            'Arial',
            'sans-serif',
        ]);
        expect(result.variables.font.serif).toEqual([
            'Times New Roman',
            'Times',
            'serif',
        ]);
        expect(result.variables.font.mono).toEqual([
            'Times New Roman',
            'Times',
            'serif',
        ]);
        expect(result.variables.font.custom).toEqual([
            'Roboto',
            'Open Sans',
            'Arial',
            'sans-serif',
        ]);
        expect(result.variables.font.fancy).toEqual([
            'Caveat',
            'cursive',
            'Roboto',
            'Open Sans',
            'Arial',
            'sans-serif',
        ]);

        // Colors
        expect(result.variables.color.primary).toBe('#123456');
        expect(result.variables.color.secondary).toBe('#123456');
        expect(result.variables.color.accent).toBe('#abcdef');
        expect(result.variables.color['*']).toBe('initial');

        // Font weights
        expect(result.variables['font-weight'].bold).toBe('700');
        expect(result.variables['font-weight'].normal).toBe('400');
        expect(result.variables['font-weight'].light).toBe('400');

        // Text
        expect(result.variables.text.lg).toBe('1.125rem');
        expect(result.variables.text['lg--line-height']).toBe('calc(1.5)');

        // Shadow, radius, breakpoint, container, aspect
        expect(result.variables.shadow.xl).toBe(
            '0 20px 25px -5px rgba(0,0,0,0.1)'
        );
        expect(result.variables.radius.full).toBe('9999px');
        expect(result.variables.breakpoint.md).toBe('48rem');
        expect(result.variables.container.lg).toBe('64rem');
        expect(result.variables.aspect.square).toBe('1 / 1');
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
});
