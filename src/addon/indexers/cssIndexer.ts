import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { TAILWIND_CSS_REGEX } from '../constants';
import { AddonOptions } from './AddonOptions';
import { indexInputs } from './indexInputs';

export const cssIndexer = (addonOptions: AddonOptions): Indexer => {
    return {
        test: TAILWIND_CSS_REGEX,
        createIndex: async (
            fileName,
            options: IndexerOptions
        ): Promise<IndexInput[]> => {
            return indexInputs(fileName, options, addonOptions);
        },
    };
};
