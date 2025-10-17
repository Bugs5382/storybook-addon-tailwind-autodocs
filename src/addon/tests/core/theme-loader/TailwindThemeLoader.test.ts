import { TailwindThemeLoader } from '../../../core/theme-loader/TailwindThemeLoader';
import { describe, expect, it } from 'vitest';

describe('TailwindThemeLoader', () => {
    // TODO: constructor tests
    describe('extractStoryPaths', () => {
        it('should return empty array for non-array stories', () => {
            const loader = new TailwindThemeLoader(undefined);
            const result = loader.extractStoryPaths(undefined);

            expect(result).toEqual([]);
        });

        it('should extract string stories', () => {
            const stories = ['src/stories/**/*.stories.tsx'];
            const loader = new TailwindThemeLoader(stories);
            const result = (loader as any).extractStoryPaths(stories);

            expect(result).toEqual(['src/stories/**/*.stories.tsx']);
        });

        it('should extract StoriesSpecifier with custom files', () => {
            const stories = [
                {
                    directory: './src/components',
                    files: '*.stories.ts',
                },
            ];
            const loader = new TailwindThemeLoader(stories);
            const result = (loader as any).extractStoryPaths(stories);

            expect(result).toEqual(['./src/components/*.stories.ts']);
        });

        it('should use default files pattern when not specified', () => {
            const stories = [
                {
                    directory: './src/components',
                },
            ];
            const loader = new TailwindThemeLoader(stories);
            const result = (loader as any).extractStoryPaths(stories);

            expect(result).toEqual([
                './src/components/**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))',
            ]);
        });

        it('should handle mixed story types', () => {
            const stories = [
                'src/stories/**/*.stories.tsx',
                {
                    directory: '../packages/components',
                    files: '*.stories.*',
                    titlePrefix: 'MyComponents',
                },
                {
                    directory: './src/pages',
                },
            ];
            const loader = new TailwindThemeLoader(stories);
            const result = (loader as any).extractStoryPaths(stories);

            expect(result).toEqual([
                'src/stories/**/*.stories.tsx',
                '../packages/components/*.stories.*',
                './src/pages/**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))',
            ]);
        });
    });
});
