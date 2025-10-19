import { ThemeLoader } from './ThemeLoader';
import { TAILWIND_CSS_REGEX } from '../../../constants';
import { ResolvedConfig } from '../../../types';
import { readFileSync } from 'fs';
import defaultTheme from 'tailwindcss/defaultTheme.js'; // TODO: Mark as external dep

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
        const customTheme = this.parseThemeFromCSS(cssContent);

        // Get base colors
        const baseColors =
            typeof defaultTheme.colors === 'function'
                ? defaultTheme.colors()
                : defaultTheme.colors || {};

        return {
            theme: {
                colors: this.deepMerge(baseColors, customTheme.colors || {}),
                fontSize: this.deepMerge(
                    defaultTheme.fontSize || {},
                    customTheme.fontSize || {}
                ),
                fontFamily: this.deepMerge(
                    defaultTheme.fontFamily || {},
                    customTheme.fontFamily || {}
                ),
                fontWeight: defaultTheme.fontWeight || {},
                // screens: this.deepMerge(
                //     defaultTheme.screens || {},
                //     customTheme.screens || {}
                // ),
                // spacing: this.deepMerge(
                //     defaultTheme.spacing || {},
                //     customTheme.spacing || {}
                // ),
                // borderRadius: this.deepMerge(
                //     defaultTheme.borderRadius || {},
                //     customTheme.borderRadius || {}
                // ),
            },
        };
    }
    // TODO: Move everything here down into a parser class
    private parseThemeFromCSS = (cssContent: string) => {
        const themeRegex = /@theme\s*{([^}]*)}/s;
        const match = cssContent.match(themeRegex);

        if (!match) {
            return {};
        }

        const themeContent = match[1];
        const colors: Record<string, any> = {};
        const fontSize: Record<string, any> = {};
        const fontFamily: Record<string, any> = {};
        const spacing: Record<string, any> = {};
        const borderRadius: Record<string, any> = {};
        const screens: Record<string, any> = {};

        // Parse custom properties line by line
        const lines = themeContent.split(';').filter(line => line.trim());

        lines.forEach(line => {
            const match = line.match(/--([^:]+):\s*([^;]+)/);
            if (!match) return;

            const [, name, value] = match;
            const trimmedName = name.trim();
            const trimmedValue = value.trim();

            // Colors
            if (trimmedName.startsWith('color-')) {
                const colorName = trimmedName.substring(6); // Remove 'color-'
                const parts = colorName.split('-');

                if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
                    const shade = parts.pop()!;
                    const name = parts.join('-');
                    if (!colors[name]) colors[name] = {};
                    colors[name][shade] = trimmedValue;
                } else {
                    colors[colorName] = trimmedValue;
                }
            }
            // Font sizes
            else if (trimmedName.startsWith('font-size-')) {
                const sizeName = trimmedName.substring(10);
                fontSize[sizeName] = trimmedValue;
            }
            // Font families
            else if (trimmedName.startsWith('font-')) {
                const familyName = trimmedName.substring(5);
                if (
                    !['size', 'weight'].some(prefix =>
                        familyName.startsWith(prefix)
                    )
                ) {
                    fontFamily[familyName] = trimmedValue
                        .split(',')
                        .map(f => f.trim());
                }
            }
            // Spacing
            else if (trimmedName.startsWith('spacing-')) {
                const spacingName = trimmedName.substring(8);
                spacing[spacingName] = trimmedValue;
            }
            // Border radius
            else if (trimmedName.startsWith('radius-')) {
                const radiusName = trimmedName.substring(7);
                borderRadius[radiusName] = trimmedValue;
            }
            // Breakpoints
            else if (trimmedName.startsWith('breakpoint-')) {
                const screenName = trimmedName.substring(11);
                screens[screenName] = trimmedValue;
            }
        });

        return {
            colors,
            fontSize,
            fontFamily,
            spacing,
            borderRadius,
            screens,
        };
    };

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
