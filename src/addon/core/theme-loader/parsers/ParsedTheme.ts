import { ThemeCssVariables } from '../../../types';

export class ParsedTheme {
    constructor(public variables: ThemeCssVariables) {}

    public isDefaultOverridden(namespace?: string): boolean {
        if (!namespace) {
            // Check for global override
            return this.variables['*']?.['*'] === 'initial';
        }
        // Check for namespace override
        return this.variables[namespace]?.['*'] === 'initial';
    }
}
