import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { TAILWIND_CONFIG_REGEX } from '../../constants';
import { indexInputs } from './indexInputs';

export const configIndexer: Indexer = {
    test: TAILWIND_CONFIG_REGEX,
    createIndex: async (
        fileName,
        options: IndexerOptions
    ): Promise<IndexInput[]> => {
        return indexInputs(fileName, options);
    },
};
