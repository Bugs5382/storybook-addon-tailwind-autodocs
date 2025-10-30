import type { IndexerOptions, IndexInput } from 'storybook/internal/types';

export const indexInputs = async (
    fileName: string,
    options: IndexerOptions
): Promise<IndexInput[]> => {
    return [
        {
            // Colors
            type: 'docs',
            importPath: fileName,
            exportName: 'Colors',
            title: options.makeTitle('Tailwind Theme/Colors'),
            tags: ['!autodocs', 'tailwind'],
        },
        {
            // Typography
            type: 'docs',
            importPath: fileName,
            exportName: 'Typography',
            title: options.makeTitle('Tailwind Theme/Typography'),
            tags: ['!autodocs', 'tailwind'],
        },
    ];
};
