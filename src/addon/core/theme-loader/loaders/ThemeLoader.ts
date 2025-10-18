import { ResolvedConfig } from '../../../types';

export abstract class ThemeLoader {
    abstract matchingRegex: RegExp;
    abstract isVersionSupported(version: number): boolean;
    abstract supportedVersionLabel(): string;

    isRegexMatch(filePath: string): boolean {
        return this.matchingRegex.test(filePath);
    }

    hasMatch(filePaths: readonly string[]): boolean {
        return filePaths.some(filePath => this.isRegexMatch(filePath));
    }

    abstract getTailwindTheme(filePath: string): Promise<ResolvedConfig>; // TODO: Update
}
