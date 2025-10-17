import { LoaderStrategy } from './LoaderStrategy';
import { TAILWIND_CONFIG_REGEX } from '../../../constants';
import { ResolvedConfig } from '../../../types';
import { serverRequire } from 'storybook/internal/common';

export class ConfigLoaderStrategy extends LoaderStrategy {
    matchingRegex: RegExp = TAILWIND_CONFIG_REGEX;

    isVersionSupported(version: number): boolean {
        return version === 3;
    }

    supportedVersionLabel(): string {
        return 'v3';
    }

    async getTailwindConfig(filePath: string): Promise<ResolvedConfig> {
        const resolveConfig = await import('tailwindcss/resolveConfig.js'); // FIXME: ts error for external dep
        const config = await serverRequire(filePath);
        const resolvedConfig = resolveConfig.default(config);

        return {
            theme: {
                colors: resolvedConfig.theme.colors,
                fontSize: resolvedConfig.theme.fontSize,
                fontFamily: resolvedConfig.theme.fontFamily,
                fontWeight: resolvedConfig.theme.fontWeight,
            },
        };
    }
}
