import { ResolvedConfig } from '../../types';
import { ThemePreparer } from './ThemePreparer';
import { CsfGenerator } from './CsfGenerator';

export class ThemeTransformer {
    private preparer: ThemePreparer;
    private generator: CsfGenerator;

    constructor(generator: CsfGenerator, preparer?: ThemePreparer) {
        this.generator = generator;
        this.preparer = preparer || new ThemePreparer();
    }

    public transformToCsf(config: ResolvedConfig): string {
        const colors = this.preparer.prepareColorsForCsf(config.theme.colors);
        const typography = this.preparer.prepareTypographyForCsf(
            config.theme.fontSize,
            config.theme.fontWeight,
            config.theme.fontFamily
        );
        return this.generator.generate(colors, typography);
    }
}
