import type { IndexerOptions, IndexInput } from 'storybook/internal/types';
import { AddonOptions } from './AddonOptions';

export const indexInputs = async (
    fileName: string,
    options: IndexerOptions,
    addonOptions: AddonOptions
): Promise<IndexInput[]> => {
    if (addonOptions.singleFileName) {
        return [
            {
                type: 'story', // gets forced as story anyway
                importPath: fileName,
                exportName: addonOptions.singleFileName,
                title: options.makeTitle(addonOptions.singleFileName),
                tags: ['!autodocs', 'tailwind-autodocs', 'single-file'],
            },
        ];
    }
    return addonOptions.sections.map(section => {
        return {
            type: 'story', // gets forced as story anyway
            importPath: fileName,
            exportName: section.name,
            title: options.makeTitle(section.path),
            tags: ['!autodocs', 'tailwind-autodocs'],
        };
    });
};
