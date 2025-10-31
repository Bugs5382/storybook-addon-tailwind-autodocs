import { Logger } from '../../../util';
import { ThemeCssVariables } from '../../../types';
import { ParsedTheme } from './ParsedTheme';

enum ThemeOption {
    Inline = 'inline',
    Static = 'static',
}

/**
 * Parses CSS theme blocks and extracts variables for Tailwind mapping.
 */
export class ThemeCssParser {
    /** Namespaces with multi-part keys */
    private static readonly multiPartNamespaces: string[] = [
        'font-weight',
        'font-size',
        'font-family',
        'text-decoration',
        'text-underline',
        'border-radius',
        'border-width',
        'border-color',
        'box-shadow',
    ];

    /** Regex to match @theme blocks */
    private static readonly themeBlockRegex =
        /@theme\s*(inline|static)?\s*\{([\s\S]*?)\}/g;

    /** Regex to match CSS variable definitions */
    private static readonly variableRegex =
        /--([a-zA-Z0-9\-*]+)\s*:\s*([^;]+);?/g;

    /** Maximum depth for recursive variable resolution */
    private static readonly MAX_REFERENCE_DEPTH = 100;

    /**
     * Parse a CSS string for theme variables and options.
     */
    static parseTheme(css: string): ParsedTheme {
        // Remove all CSS comments first
        const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

        const variables: ThemeCssVariables = {};
        let options: Partial<Record<ThemeOption, boolean>> = {};
        const allVars: Record<string, string> = {};

        let match: RegExpExecArray | null;
        while ((match = this.themeBlockRegex.exec(cssWithoutComments))) {
            options = {};
            const option = match[1]?.trim() as ThemeOption | undefined;
            if (option && Object.values(ThemeOption).includes(option)) {
                options[option] = true;
            }
            const block = match[2];
            this.parseVariables(block, variables, allVars);
        }

        if (options[ThemeOption.Inline]) {
            this.resolveInlineReferences(variables, allVars);
        } else {
            this.cleanFontVariables(variables);
        }

        return new ParsedTheme(variables);
    }

    /**
     * Parse variable definitions from a theme block.
     */
    // Replace the parseVariables method in src/addon/core/theme-loader/parsers/ThemeCssParser.ts

    private static parseVariables(
        block: string,
        variables: ThemeCssVariables,
        allVars: Record<string, string>
    ): void {
        let varMatch: RegExpExecArray | null;
        while ((varMatch = this.variableRegex.exec(block))) {
            const rawName = varMatch[1].trim();
            const value = varMatch[2].trim();
            const { namespace, key } = this.extractNamespaceAndKey(rawName);

            // Handle global reset
            if (rawName === '*') {
                for (const ns in variables) delete variables[ns];
                for (const k in allVars) delete allVars[k];
                variables['*'] = { '*': value };
                allVars['*'] = value;
                continue;
            }

            // Handle namespace reset
            if (key === '*') {
                if (variables[namespace]) delete variables[namespace];
                Object.keys(allVars).forEach(k => {
                    if (k === rawName || k.startsWith(namespace + '-'))
                        delete allVars[k];
                });
                if (!variables[namespace]) variables[namespace] = {};
                variables[namespace]['*'] = value;
                allVars[rawName] = value;
                continue;
            }

            if (!variables[namespace]) variables[namespace] = {};
            variables[namespace][key] = value;
            allVars[rawName] = value;
        }
    }

    /**
     * Extract namespace and key from a variable name.
     */
    private static extractNamespaceAndKey(rawName: string): {
        namespace: string;
        key: string;
    } {
        for (const ns of this.multiPartNamespaces) {
            if (rawName.startsWith(ns + '-')) {
                return { namespace: ns, key: rawName.slice(ns.length + 1) };
            }
        }
        const [namespace, ...rest] = rawName.split('-');
        return { namespace, key: rest.join('-') || namespace };
    }

    /**
     * Clean font variables by splitting and stripping quotes.
     */
    private static cleanFontVariables(variables: ThemeCssVariables): void {
        if (variables.font) {
            for (const key in variables.font) {
                const val = variables.font[key];

                // If we're ignoring the font namespace, leave as is
                if (
                    key === '*' &&
                    typeof val === 'string' &&
                    val === 'initial'
                ) {
                    variables.font[key] = 'initial';
                } else {
                    variables.font[key] = this.cleanFontArray(val as string);
                }
            }
        }
    }

    /**
     * Recursively resolve a font value, following var(--...) references.
     * Logs an error if maximum recursion depth is reached.
     */
    private static resolveFontValue(
        value: string,
        allVars: Record<string, string>,
        depth: number = 0
    ): string {
        if (depth > this.MAX_REFERENCE_DEPTH) {
            Logger.error(
                `Maximum recursion depth (${this.MAX_REFERENCE_DEPTH}) reached while resolving ${value} in your CSS config.`
            );
            return value;
        }
        // If value contains multiple comma-separated items, resolve each
        if (value.includes(',')) {
            return value
                .split(',')
                .map(item =>
                    this.resolveFontValue(item.trim(), allVars, depth + 1)
                )
                .join(',');
        }
        const refMatch = /^var\(--([a-zA-Z0-9\-]+)\)$/.exec(value);
        if (refMatch) {
            const refName = refMatch[1];
            const refVal = allVars[refName];
            if (refVal) {
                return this.resolveFontValue(refVal, allVars, depth + 1);
            }
        }
        return value;
    }

    /**
     * Resolve inline references and clean font variables (with recursion).
     */
    private static resolveInlineReferences(
        variables: ThemeCssVariables,
        allVars: Record<string, string>
    ): void {
        for (const ns in variables) {
            for (const key in variables[ns]) {
                let val = variables[ns][key] as string;
                if (ns === 'font') {
                    // Recursively resolve all var(--...) in font values, ignoring 'initial'
                    val = this.resolveFontValue(val, allVars);
                    if (key === '*' && val === 'initial') {
                        variables[ns][key] = 'initial';
                    } else {
                        variables[ns][key] = this.cleanFontArray(val);
                    }
                } else {
                    // For other namespaces, resolve one level of var(--...) if present
                    const refMatch = /^var\(--([a-zA-Z0-9\-]+)\)$/.exec(val);
                    if (refMatch) {
                        const refName = refMatch[1];
                        const refVal = allVars[refName];
                        if (refVal) {
                            variables[ns][key] = refVal;
                        }
                    }
                }
            }
        }
    }

    /**
     * Split font family strings and strip quotes.
     */
    private static cleanFontArray(val: string): string[] {
        return val
            .replace(/^['"]|['"]$/g, '')
            .split(',')
            .map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    }
}
