import type { IndexerOptions, IndexInput } from 'storybook/internal/types';
import { AddonOptions } from '../core/theme-transformer';

export const indexInputs = async (
    fileName: string,
    options: IndexerOptions,
    addonOptions: AddonOptions
): Promise<IndexInput[]> => {
    if (addonOptions.forceSingleDoc !== undefined) {
        return [
            {
                type: 'story', // gets forced as story anyway
                importPath: fileName,
                exportName: addonOptions.forceSingleDoc.name,
                title: options.makeTitle(addonOptions.forceSingleDoc.path),
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
