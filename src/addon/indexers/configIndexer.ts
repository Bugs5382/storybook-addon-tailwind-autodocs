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
                exportName: 'Colors',
                title: options.makeTitle('Colors'),
                tags: ['!autodocs', 'tailwind'],
                __id: `colors--colors`,
            }

            // TODO: Typography
        ];
    }
};
