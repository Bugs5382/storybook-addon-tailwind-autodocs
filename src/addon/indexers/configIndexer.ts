import type {
    Indexer,
    IndexerOptions,
    IndexInput,
} from 'storybook/internal/types';
import { TAILWIND_CONFIG_REGEX } from '../constants';
import { indexInputs } from './indexInputs';
import { AddonOptions } from '../core/theme-transformer/AddonOptions';

export const configIndexer = (addonOptions: AddonOptions): Indexer => {
    return {
        test: TAILWIND_CONFIG_REGEX,
        createIndex: async (
            fileName: string,
            options: IndexerOptions
        ): Promise<IndexInput[]> => {
            return indexInputs(fileName, options, addonOptions);
        },
    };
};
