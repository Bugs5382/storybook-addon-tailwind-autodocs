import { LoaderStrategy } from './LoaderStrategy';
import { TAILWIND_CONFIG_REGEX } from '../../../constants';
import { getV3Config } from '../../../getV3Config';

export class ConfigLoaderStrategy extends LoaderStrategy {
    matchingRegex: RegExp = TAILWIND_CONFIG_REGEX;

    isVersionSupported(version: number): boolean {
        return version === 3;
    }

    supportedVersionLabel(): string {
        return 'v3';
    }

    async getTailwindConfig(filePath: string): Promise<any> {
        return await getV3Config(filePath);
    }
}
