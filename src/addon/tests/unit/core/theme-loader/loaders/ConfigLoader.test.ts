import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigLoader } from '../../../../../core/theme-loader/loaders';
import {
    mockRequireModule,
    restoreRequireModule,
} from '../../mockRequireModule';
import { serverRequire } from 'storybook/internal/common';

vi.mock('storybook/internal/common', () => ({
    serverRequire: vi.fn(),
}));

const mockServerRequire = vi.mocked(serverRequire);

describe('ConfigLoader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        restoreRequireModule();
    });

    it('loads and resolves extended Tailwind config', async () => {
        const fakeConfig = {
            content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
            theme: {
                extend: {
                    colors: {
                        'red-ish': {
                            100: '#ff0040',
                            200: '#f12000',
                            300: '#ff3202',
                            400: '#ff0220',
                        },
                    },
                    fontSize: {
                        xxs: '5rem',
                    },
                    fontFamily: {
                        inter: ['Inter', 'sans-serif'],
                    },
                },
            },
            // TODO: Ignoring the type error for now until I do SB10 migration work.
            // @ts-ignore
            plugins: [],
        };
        mockServerRequire.mockResolvedValue(fakeConfig);
        mockRequireModule('tailwindcss/resolveConfig', () => {
            const defaultTheme = {
                colors: {
                    gray: { 100: '#eee', 200: '#ddd' },
                    black: '#000',
                    white: '#fff',
                },
                fontSize: { sm: ['0.875rem', { lineHeight: '1.25rem' }] },
                fontFamily: { mono: ['Menlo', 'monospace'] },
                fontWeight: { normal: '400' },
            };
            return {
                theme: {
                    colors: {
                        ...defaultTheme.colors,
                        ...fakeConfig.theme.extend.colors,
                    },
                    fontSize: {
                        ...defaultTheme.fontSize,
                        ...fakeConfig.theme.extend.fontSize,
                    },
                    fontFamily: {
                        ...defaultTheme.fontFamily,
                        ...fakeConfig.theme.extend.fontFamily,
                    },
                    fontWeight: {
                        ...defaultTheme.fontWeight,
                    },
                },
            };
        });

        const loader = new ConfigLoader();
        const result = await loader.getTailwindTheme('tailwind.config.js');

        expect(result.theme.colors).toEqual({
            gray: { 100: '#eee', 200: '#ddd' },
            black: '#000',
            white: '#fff',
            'red-ish': {
                100: '#ff0040',
                200: '#f12000',
                300: '#ff3202',
                400: '#ff0220',
            },
        });
        expect(result.theme.fontSize).toEqual({
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            xxs: '5rem',
        });
        expect(result.theme.fontFamily).toEqual({
            mono: ['Menlo', 'monospace'],
            inter: ['Inter', 'sans-serif'],
        });
        expect(result.theme.fontWeight).toEqual({
            normal: '400',
        });
    });
});
