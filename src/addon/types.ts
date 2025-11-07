import { ThemeLoader } from './core/theme-loader';
import { VALID_SECTIONS } from './constants';
import { AddonOptions } from './core/theme-transformer';

export interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

export interface PluginOptions {
    themeLoader: ThemeLoader;
    addonOptions: AddonOptions;
}

export type TailwindConfigSections = (typeof VALID_SECTIONS)[number];

export type SectionInput<NameType extends string> =
    | NameType
    | {
          name: NameType;
          path?: string;
      };

export type TailwindSectionInput = SectionInput<TailwindConfigSections>;
export type CustomSectionInput = SectionInput<string>;

export interface NormalizedSection {
    name: string;
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
