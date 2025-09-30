import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { TAILWIND_CSS_REGEX } from '../constants';
import { createCustomCsfIndexInputs } from './indexInputs';

export const cssIndexer: Indexer = {
    test: TAILWIND_CSS_REGEX,

    createIndex: async (
        fileName,
        options: IndexerOptions
    ): Promise<IndexInput[]> => {
        // Check if this is a Tailwind v4 CSS file
        return createCustomCsfIndexInputs(fileName, options);
    },
};
