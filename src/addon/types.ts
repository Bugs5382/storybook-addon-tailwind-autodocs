import { ThemeLoader } from './core/theme-loader';
import { VALID_SECTIONS } from './constants';

export interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

export interface PluginOptions {
    themeLoader: ThemeLoader;
}

export type SectionInput =
    | ValidSections
    | {
          name: ValidSections;
          path?: string;
      };
export type ValidSections = (typeof VALID_SECTIONS)[number];

export interface Section {
    name: ValidSections;
    path: string;
}

export interface ResolvedConfig {
    theme: {
        colors: Record<string, any>;
        fontSize: Record<string, any>;
        fontFamily: Record<string, any>;
        fontWeight: Record<string, any>;
        // screens: Record<string, any>; // TODO
        // spacing: Record<string, any>; // TODO
        // borderRadius: Record<string, any>; // TODO
    };
}

export interface Typography {
    type: Record<string, string>;
    weight: Record<string, string>;
    size: Record<string, string>;
}

export type ThemeCssVariables = Record<
    string,
    Record<string, string | string[]>
>;

export type SupportedFontUnit =
    | 'rem'
    | 'em'
    | 'px'
    | 'pt'
    | 'cm'
    | 'mm'
    | 'in'
    | 'pc'
    | '%';
