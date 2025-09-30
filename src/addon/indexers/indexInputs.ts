import type { IndexerOptions, IndexInput } from 'storybook/internal/types';
import { serverRequire } from 'storybook/internal/common';
import resolveConfig from 'tailwindcss/resolveConfig';
import { generateCsf } from '../compile';
import { loadCsf } from 'storybook/internal/csf-tools';

export const createCustomCsfIndexInputs = async (
    fileName: string,
    options: IndexerOptions
): Promise<IndexInput[]> => {
    // logConfigCsfGeneratedIndex(fileName, options); // For testing purposes, to see the generated CSF
    console.log('Successfully indexed Tailwind: ', fileName);
    return [
        {
            // Colors
            type: 'docs',
            importPath: fileName,
            exportName: 'Colors',
            title: options.makeTitle('Colors'),
            tags: ['!autodocs', 'tailwind'],
        },
        {
            // Typegraphy
            type: 'docs',
            importPath: fileName,
            exportName: 'Typography', // TODO: Fix this, currently just for testing
            title: options.makeTitle('Typography'), // TODO: Fix this, currently just for testing
            tags: ['!autodocs', 'tailwind'],
        },

        // TODO: Typography
    ];
};

// For testing purposes, to see the generated CSF
const logConfigCsfGeneratedIndex = async (
    fileName: string,
    options: IndexerOptions
): void => {
    console.log('WARNING: ONLY VALID FOR CONFIG');
    delete require.cache[fileName];
    const config = await serverRequire(fileName);
    const fullTailwindConfig = resolveConfig(config);
    const colors = fullTailwindConfig.theme.colors;
    const test = await generateCsf(colors);
    const indexed = loadCsf(test, { ...options, fileName }).parse();
    console.log(indexed.indexInputs);
};
