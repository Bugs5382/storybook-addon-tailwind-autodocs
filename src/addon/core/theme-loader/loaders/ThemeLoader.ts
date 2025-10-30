import { ResolvedConfig } from '../../../types';

export abstract class ThemeLoader {
    public abstract matchingRegex: RegExp;
    public abstract isVersionSupported(version: number): boolean;
    public abstract supportedVersionLabel(): string;

    public isRegexMatch(filePath: string): boolean {
        return this.matchingRegex.test(filePath);
    }

    public hasMatch(filePaths: readonly string[]): boolean {
        return filePaths.some(filePath => this.isRegexMatch(filePath));
    }

    public abstract getTailwindTheme(filePath: string): Promise<ResolvedConfig>;

    public abstract resolveId(filePath: string): string | null;
}
