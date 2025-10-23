import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeLoaderManager } from '../../../core/theme-loader';
import { ConfigLoader, CssLoader } from '../../../core/theme-loader/loaders';
import { TailwindPackageVersionDetector } from '../../../core/package-detection';
import { Logger } from '../../../util';

// Mock external dependencies before imports
vi.mock('fs');
vi.mock('storybook/internal/common');
vi.mock('../../../util');

describe('ThemeLoaderManager', () => {
    let mockDetector: TailwindPackageVersionDetector;

    beforeEach(() => {
        vi.clearAllMocks();
        mockDetector = {
            getTailwindVersionIfGreaterThanMinimum: vi.fn(),
        } as any;
    });

    describe('loader selection', () => {
        it('should select ConfigLoader for v3 with config file', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(3);

            const manager = new ThemeLoaderManager(
                ['src/**/*.stories.tsx', 'tailwind.config.js'],
                mockDetector
            );

            expect(manager.getLoader()).toBeInstanceOf(ConfigLoader);
        });

        it('should select CssLoader for v4 with CSS file', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(4);

            const manager = new ThemeLoaderManager(
                ['src/**/*.stories.tsx', 'src/app.css'],
                mockDetector
            );

            expect(manager.getLoader()).toBeInstanceOf(CssLoader);
        });
    });

    describe('error handling', () => {
        it('should return null when no config file found', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(3);

            const manager = new ThemeLoaderManager(
                ['src/**/*.stories.tsx'],
                mockDetector
            );

            expect(manager.getLoader()).toBeNull();
            expect(Logger.error).toHaveBeenCalledWith(
                expect.stringContaining('No Tailwind configuration file')
            );
        });

        it('should return null when multiple config files found', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(4);

            const manager = new ThemeLoaderManager(
                ['tailwind.config.js', 'src/app.css'],
                mockDetector
            );

            expect(manager.getLoader()).toBeNull();
            expect(Logger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Multiple tailwind configuration files')
            );
        });

        it('should return null when version mismatch (v3 config with v4)', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(4);

            const manager = new ThemeLoaderManager(
                ['tailwind.config.js'],
                mockDetector
            );

            expect(manager.getLoader()).toBeNull();
            expect(Logger.error).toHaveBeenCalledWith(
                expect.stringContaining('Version mismatch')
            );
        });

        it('should return null when Tailwind not installed', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(null);

            const manager = new ThemeLoaderManager(
                ['tailwind.config.js'],
                mockDetector
            );

            expect(manager.getLoader()).toBeNull();
            expect(Logger.warn).toHaveBeenCalledWith(
                expect.stringContaining('make sure Tailwind CSS')
            );
        });
    });

    describe('extractStoryPaths', () => {
        it('should extract string paths', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(3);

            const manager = new ThemeLoaderManager([], mockDetector);
            const paths = manager.extractStoryPaths([
                'src/stories/*.tsx',
                'tailwind.config.js',
            ]);

            expect(paths).toEqual(['src/stories/*.tsx', 'tailwind.config.js']);
        });

        it('should extract paths from StoriesSpecifier objects', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(3);

            const manager = new ThemeLoaderManager([], mockDetector);
            const paths = manager.extractStoryPaths([
                { directory: 'src', files: '*.stories.tsx' },
                { directory: 'components' },
            ]);

            expect(paths).toEqual([
                'src/*.stories.tsx',
                'components/**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))',
            ]);
        });

        it('should handle mixed string and object stories', () => {
            vi.mocked(
                mockDetector.getTailwindVersionIfGreaterThanMinimum
            ).mockReturnValue(3);

            const manager = new ThemeLoaderManager([], mockDetector);
            const paths = manager.extractStoryPaths([
                'tailwind.config.js',
                { directory: 'src', files: '*.stories.tsx' },
                'app.css',
            ]);

            expect(paths).toEqual([
                'tailwind.config.js',
                'src/*.stories.tsx',
                'app.css',
            ]);
        });
    });
});
