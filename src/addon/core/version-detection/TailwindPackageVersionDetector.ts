// src/addon/core/version-detection/PackageVersionDetector.ts
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { Logger } from '../util';
import { MIN_SUPPORTED_TAILWIND_VERSION } from '../../constants';

export class TailwindPackageVersionDetector {
    constructor(private projectRoot?: string) {}

    /**
     * @returns the major version (>3) of the installed package, or null if not supported / found / an error has occurred.
     */
    public getTailwindVersionIfGreaterThanMinimum(): number | null {
        try {
            const majorVersion = this.getMajorVersion('tailwindcss');
            if (majorVersion >= MIN_SUPPORTED_TAILWIND_VERSION) {
                return majorVersion;
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            Logger.error(
                `Unable to detect Tailwind CSS installation in your package.json: ${errorMessage}. `
            );
        }
        return null;
    }

    /**
     * @param packageName
     * @throws Error
     */
    private getMajorVersion(packageName: string): number | null {
        const version = this.getPackageVersion(packageName);
        if (version === null) return null;

        const majorVersion = parseInt(version.split('.')[0], 10);
        if (isNaN(majorVersion)) {
            throw new Error(`Invalid version format: ${version}`);
        }
        return majorVersion;
    }

    /**
     * @param packageName
     * @throws Error
     */
    private getPackageVersion(packageName: string): string | null {
        const packageJson = this.readPackageJson();
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        const version = dependencies[packageName];
        return version ? this.cleanVersionString(version) : null;
    }

    /**
     * @param projectRoot
     * @throws Error
     */
    private readPackageJson(projectRoot?: string): PackageJson {
        const basePath = projectRoot || process.cwd();
        const packageJsonPath = resolve(basePath, 'package.json');

        if (!existsSync(packageJsonPath)) {
            throw new Error(`package.json not found at ${packageJsonPath}`);
        }

        try {
            const content = readFileSync(packageJsonPath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(
                    `Invalid package.json file at ${packageJsonPath}`
                );
            }
            throw error;
        }
    }

    private cleanVersionString(versionString: string): string {
        return versionString.replace(/^[\^~>=<]+/, '').trim();
    }
}
