import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { TAILWIND_CONFIG_REGEX } from '../constants';
import { createCustomCsfIndexInputs } from './indexInputs';

/**
 * An indexer that processes tailwind.config.js or tailwind.config.ts files
 */
export const configIndexer: Indexer = {
    test: TAILWIND_CONFIG_REGEX,

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
