import { Section, SectionInput, ValidSections } from '../types';
import { VALID_SECTIONS } from '../constants';

export class AddonOptions {
    private readonly defaultPath: string;
    public sections: Section[];
    public singleFileName?: string;

    constructor(
        defaultPath: string = 'Tailwind Theme/',
        sections: SectionInput[] = VALID_SECTIONS,
        singleFileName?: string
    ) {
        this.validateDefaultPath(defaultPath);
        this.validateSections(sections);
        this.validateSingleFileName(singleFileName);
        this.defaultPath = defaultPath;
        this.sections = this.normalizeSections(sections);
        this.singleFileName = singleFileName;
    }

    private validateSingleFileName(singleFileName?: string) {
        if (
            singleFileName !== undefined &&
            (typeof singleFileName !== 'string' || !singleFileName.trim())
        ) {
            throw new Error(
                'singleFileName must be a non-empty string if defined'
            );
        }
    }

    private validateDefaultPath(defaultPath: string) {
        if (typeof defaultPath !== 'string' || !defaultPath.trim()) {
            throw new Error('defaultPath must be a non-empty string');
        }
    }

    private validateSections(sections: SectionInput[]) {
        if (!Array.isArray(sections)) {
            throw new Error('sections must be an array');
        }
        for (const section of sections) {
            if (this.isValidSectionName(section)) {
                continue;
            }
            if (this.isValidSectionObject(section)) {
                continue;
            }
            throw new Error(
                'Invalid section: must be a valid string or name and optional path'
            );
        }
    }

    private isValidSectionName(name: any): name is ValidSections {
        return (
            typeof name === 'string' &&
            VALID_SECTIONS.includes(name as ValidSections)
        );
    }

    private isValidSectionObject(
        section: any
    ): section is { name: ValidSections; path?: string } {
        return (
            typeof section === 'object' &&
            section !== null &&
            this.isValidSectionName(section.name) &&
            (section.path === undefined ||
                (typeof section.path === 'string' && section.path.trim()))
        );
    }

    private normalizeSections(sections: SectionInput[]): Section[] {
        return sections.map(section => {
            const name = typeof section === 'string' ? section : section.name;
            let path =
                typeof section === 'string'
                    ? this.defaultPath
                    : (section.path ?? this.defaultPath);
            if (path.endsWith('/')) {
                if (path === '/') {
                    path = name;
                } else {
                    path = `${path}${name}`;
                }
            }
            return { name, path };
        });
    }
}
