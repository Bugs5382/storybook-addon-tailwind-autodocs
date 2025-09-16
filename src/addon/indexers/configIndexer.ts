import type { Indexer, IndexerOptions, IndexInput } from 'storybook/internal/types';
import { serverRequire } from 'storybook/internal/common';
import { loadCsf } from 'storybook/internal/csf-tools';
import resolveConfig from 'tailwindcss/resolveConfig';
import { getCsfFromConfig } from '../compile';
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
    createIndex: async (fileName, options: IndexerOptions): Promise<IndexInput[]> => {
        return createCustomCsfIndexInputs(fileName, options);
    }
};

const createCustomCsfIndexInputs = async (fileName: string, options: IndexerOptions): Promise<IndexInput[]> => {
    return [
        {
            // Colors
            type: 'docs',
                importPath: fileName,
            exportName: 'Colors',
            title: options.makeTitle('Theme/Colors'),
            tags: ['!autodocs', 'tailwind'],
            __id: `colors--colors`,
        },
        // TODO: Typography
    ];
};

/**
 * @deprecated - Using custom CSF index instead
 * @param fileName
 * @param options
 */
const createMdxIndex = async (fileName: string, options: IndexerOptions) => {
    // TODO: Decide if I want to do it this way, useful for debugging for now
    // delete require.cache[fileName];
    // const config = await serverRequire(fileName);
    // const fullTailwindConfig = resolveConfig(config);
    // const colors = fullTailwindConfig.theme.colors;
    // const fontSizes = fullTailwindConfig.theme.fontSize;
    // const fontWeights = fullTailwindConfig.theme.fontWeight;
    // const fontFamilies = fullTailwindConfig.theme.fontFamily;
    // const test = await getCsfFromConfig(colors, fontSizes, fontWeights, fontFamilies);
    // const indexed = loadCsf(test, {...options,fileName }).parse();
    // const testing = indexed.indexInputs;
    // console.log(testing);
    return [
        {
            // Colors
            type: 'docs',
            importPath: fileName,
            exportName: 'Docs', // must be Docs (or whatever is set as autodocs default name) in order to not generate story
            title: options.makeTitle('Theme'), // must match the title in the mdx file in order to go to load the mdx file when clicked
            tags: ['autodocs'], // Note: MUST contain autodocs to generate docs file
        }
    ];
}