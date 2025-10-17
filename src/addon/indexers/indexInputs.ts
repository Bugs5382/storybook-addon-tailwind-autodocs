import type { IndexerOptions, IndexInput } from 'storybook/internal/types';

export const createCustomCsfIndexInputs = async (
    fileName: string,
    options: IndexerOptions
): Promise<IndexInput[]> => {
    return [
        {
            // Colors
            type: 'docs',
            importPath: fileName,
            exportName: 'Colors',
            title: options.makeTitle('Theme'),
            tags: ['!autodocs', 'tailwind'],
        },
        {
            // Typography
            type: 'docs',
            importPath: fileName,
            exportName: 'Typography', // TODO: Fix this, currently just for testing
            title: options.makeTitle('Theme'), // TODO: Fix this, currently just for testing
            tags: ['!autodocs', 'tailwind'],
        },
    ];
};
