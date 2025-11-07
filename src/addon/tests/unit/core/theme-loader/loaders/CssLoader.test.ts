import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { CssLoader } from '../../../../../core/theme-loader/loaders';
import {
    mockRequireModule,
    restoreRequireModule,
} from '../../mockRequireModule';
import { ParsedTheme } from '../../../../../core/theme-loader/parsers';
import { VIRTUAL_FILE_PREFIX } from '../../../../../constants';
import { ThemeCssVariables } from '../../../../../types';

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
}));

const mockReadFileSync = vi.mocked(readFileSync);
const makeMockParser = (variables: ThemeCssVariables) => {
    return {
        parseTheme: vi.fn().mockReturnValue(new ParsedTheme(variables)),
    };
};

describe('CssLoader', () => {
    describe('getTailwindTheme', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockReadFileSync.mockReturnValue('irrelevant');
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

        it('maps theme variables to Tailwind config', async () => {
            const mockParser = makeMockParser({
                color: { 'primary-100': '#f00', 'primary-200': '#c00' },
                font: { sans: ['Arial', 'sans-serif'] },
                'font-weight': { bold: '700' },
                text: { lg: '1.125rem' },
            });
            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme).toStrictEqual({
                colors: {
                    gray: { 100: '#eee' },
                    black: '#000',
                    white: '#fff',
                    primary: {
                        '100': '#f00',
                        '200': '#c00',
                    },
                },
                fontFamily: {
                    mono: ['Menlo', 'monospace'],
                    sans: ['Arial', 'sans-serif'],
                },
                fontWeight: {
                    normal: '400',
                    bold: '700',
                },
                fontSize: {
                    sm: ['0.875rem', { lineHeight: '1.25rem' }],
                    lg: '1.125rem',
                },
            });
        });
        it('discards previous variables after a global reset', async () => {
            const mockParser = makeMockParser({
                '*': { '*': 'initial' },
                color: { secondary: '#000' },
                font: {},
                'font-weight': {},
                text: {},
            });
            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme).toStrictEqual({
                colors: {
                    secondary: '#000',
                },
                fontFamily: {},
                fontWeight: {},
                fontSize: {},
            });
        });

        it('does not resolve references to variables defined before a namespace reset', async () => {
            const mockParser = makeMockParser({
                font: {
                    '*': 'initial',
                    sans: ['var(--font-inter)'],
                },
            });
            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme).toStrictEqual({
                colors: {
                    gray: { 100: '#eee' },
                    black: '#000',
                    white: '#fff',
                },
                fontFamily: {
                    sans: ['var(--font-inter)'],
                },
                fontWeight: {
                    normal: '400',
                },
                fontSize: {
                    sm: ['0.875rem', { lineHeight: '1.25rem' }],
                },
            });
        });

        it('does not resolve references to color variables defined before a namespace reset', async () => {
            const mockParser = makeMockParser({
                color: {
                    '*': 'initial',
                    secondary: 'var(--color-primary)',
                },
            });
            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme).toStrictEqual({
                colors: {
                    secondary: 'var(--color-primary)',
                },
                fontFamily: {
                    mono: ['Menlo', 'monospace'],
                },
                fontWeight: {
                    normal: '400',
                },
                fontSize: {
                    sm: ['0.875rem', { lineHeight: '1.25rem' }],
                },
            });
        });

        it('overrides defaultTheme values with CSS variables', async () => {
            const mockParser = makeMockParser({
                color: { black: '#111' },
                font: { mono: ['Fira Mono', 'monospace'] },
            });
            const loader = new CssLoader(mockParser as any);
            const result = await loader.getTailwindTheme('fake/path/theme.css');
            expect(result.theme).toStrictEqual({
                colors: {
                    gray: { 100: '#eee' },
                    black: '#111',
                    white: '#fff',
                },
                fontFamily: {
                    mono: ['Fira Mono', 'monospace'],
                },
                fontWeight: {
                    normal: '400',
                },
                fontSize: {
                    sm: ['0.875rem', { lineHeight: '1.25rem' }],
                },
            });
        });
    });
    describe('resolveId', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });
        it('returns virtual file path if @import tailwindcss is present', () => {
            mockReadFileSync.mockReturnValue('@import "tailwindcss";');
            const loader = new CssLoader();
            const result = loader.baseResolveId('styles.css');
            expect(result).toBe(VIRTUAL_FILE_PREFIX + 'styles.css');
        });
        it('returns null if @import tailwindcss is not present', () => {
            mockReadFileSync.mockReturnValue('body { color: red; }');
            const loader = new CssLoader();
            const result = loader.baseResolveId('styles.css');
            expect(result).toBeNull();
        });
    });
});
