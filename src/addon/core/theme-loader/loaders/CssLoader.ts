// src/addon/core/theme-loader/loaders/CssLoader.ts
import { ThemeLoader } from './ThemeLoader';
import { TAILWIND_CSS_REGEX } from '../../../constants';
import { ResolvedConfig } from '../../../types';
import { readFileSync } from 'fs';
import { ThemeCssParser } from '../parsers/ThemeCssParser';

export class CssLoader extends ThemeLoader {
    public matchingRegex: RegExp = TAILWIND_CSS_REGEX;

    public isVersionSupported(version: number): boolean {
        return version >= 4;
    }

    public supportedVersionLabel(): string {
        return 'v4+';
    }

    public getTailwindTheme(filePath: string): Promise<ResolvedConfig> {
        const cssContent = readFileSync(filePath, 'utf-8');
        const { variables } = ThemeCssParser.parseTheme(cssContent);
        const defaultTheme = require('tailwindcss/defaultTheme');
        const baseColors =
            typeof defaultTheme.colors === 'function'
                ? defaultTheme.colors()
                : defaultTheme.colors || {};

        console.log(baseColors);
        const mapped = this.mapThemeVariablesToTailwind(
            variables,
            defaultTheme
        );
        // TODO: Add ability to detect when 'initial' is used, and ignoring the merging of defaultTheme based on that

        return Promise.resolve({
            theme: {
                colors: this.deepMerge(baseColors, mapped.colors),
                fontSize: this.deepMerge(
                    defaultTheme.fontSize || {},
                    mapped.fontSize
                ),
                fontFamily: this.deepMerge(
                    defaultTheme.fontFamily || {},
                    mapped.fontFamily
                ),
                fontWeight: this.deepMerge(
                    defaultTheme.fontWeight || {},
                    mapped.fontWeight
                ),
                // TODO: Breakpoints etc
            },
        });
    }

    private mapThemeVariablesToTailwind(
        variables: Record<string, Record<string, any>>,
        defaultTheme: any
    ) {
        return {
            colors: this.groupColorVariables(variables['color'] || {}),
            fontFamily: variables['font'] || {},
            fontWeight: variables['font-weight'] || {},
            fontSize: variables['text'] || {},
            // Add more mappings as needed
        };
    }

    // Groups flat color keys into nested objects
    private groupColorVariables(
        flatColors: Record<string, string>
    ): Record<string, any> {
        const grouped: Record<string, any> = {};
        for (const key in flatColors) {
            const match = /^([a-zA-Z0-9\-]+)-(\d{2,3})$/.exec(key);
            if (match) {
                const group = match[1];
                const shade = match[2];
                if (!grouped[group]) grouped[group] = {};
                grouped[group][shade] = flatColors[key];
            } else {
                grouped[key] = flatColors[key];
            }
        }
        return grouped;
    }

    private deepMerge = (target: any, source: any): any => {
        const output = { ...target };

        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }

        return output;
    };

    private isObject = (item: any): boolean => {
        return item && typeof item === 'object' && !Array.isArray(item);
    };
}
