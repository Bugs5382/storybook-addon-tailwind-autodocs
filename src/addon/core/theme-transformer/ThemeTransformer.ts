import { ResolvedConfig, Typography } from '../../types';
import { ThemePreparer } from './ThemePreparer';
import { CsfGenerator } from './CsfGenerator';

export class ThemeTransformer {
    private preparer: ThemePreparer;
    private generator: CsfGenerator;

    constructor(preparer?: ThemePreparer, generator?: CsfGenerator) {
        this.preparer = preparer || new ThemePreparer();
        this.generator = generator || new CsfGenerator();
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
