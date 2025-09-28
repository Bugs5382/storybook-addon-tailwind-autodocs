import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { serverRequire } from 'storybook/internal/common';
import { loadCsf } from 'storybook/internal/csf-tools';
import resolveConfig from 'tailwindcss/resolveConfig';
import { generateCsf } from '../compile';
import { TAILWIND_REGEX } from '../constants';

/**
 * An indexer that processes tailwind.config.js or tailwind.config.ts files
 */
export const configIndexer: Indexer = {
    test: TAILWIND_REGEX,

    /**
     * Creates index inputs from a Tailwind CSS configuration file.
     * @param fileName - The path to the Tailwind CSS configuration file.
     * @param options - Options for the indexer.
     */
    createIndex: async (
        fileName,
        options: IndexerOptions
    ): Promise<IndexInput[]> => {
        return createCustomCsfIndexInputs(fileName, options);
    },
};

const createCustomCsfIndexInputs = async (
    fileName: string,
    options: IndexerOptions
): Promise<IndexInput[]> => {
    // logCsfGeneratedIndex(fileName, options); // For testing purposes, to see the generated CSF
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
const logCsfGeneratedIndex = async (
    fileName: string,
    options: IndexerOptions
): void => {
    delete require.cache[fileName];
    const config = await serverRequire(fileName);
    const fullTailwindConfig = resolveConfig(config);
    const colors = fullTailwindConfig.theme.colors;
    const test = await generateCsf(colors);
    const indexed = loadCsf(test, { ...options, fileName }).parse();
    console.log(indexed.indexInputs);
};
