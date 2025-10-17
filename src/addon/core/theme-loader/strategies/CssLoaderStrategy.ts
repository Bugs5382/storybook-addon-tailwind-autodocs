import { LoaderStrategy } from './LoaderStrategy';
import { TAILWIND_CSS_REGEX } from '../../../constants';
import { getV4Config } from '../../../getV4Config';

export class CssLoaderStrategy extends LoaderStrategy {
    matchingRegex: RegExp = TAILWIND_CSS_REGEX;

    isVersionSupported(version: number): boolean {
        return version >= 4;
    }

    supportedVersionLabel(): string {
        return 'v4+';
    }

    getTailwindConfig(filePath: string): any {
        return getV4Config(filePath);
    }
}
