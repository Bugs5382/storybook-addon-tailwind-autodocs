import { resolve } from 'path';
import { readFileSync } from 'fs';

/**
 * Get the installed Tailwind CSS version from package.json
 * Throws an error if Tailwind CSS is not installed or if the version is less than
 * 3.0.
 * @param projectRoot
 */
export function getTailwindVersion(projectRoot?: string): string {
    const basePath = projectRoot || process.cwd();
    const packageJsonPath = resolve(basePath, 'package.json');

    try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

        // Check dependencies and devDependencies
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };

        const tailwindVersion = dependencies['tailwindcss'];

        if (!tailwindVersion) {
            throw new Error('Tailwind CSS is not installed. Please install tailwindcss version 3.0 or higher.');
        }

        // Remove version range prefixes (^, ~, >=, etc.)
        const cleanVersion = tailwindVersion.replace(/^[\^~>=<]+/, '');

        // Check if version is 3.0 or higher
        const majorVersion = parseInt(cleanVersion.split('.')[0]);
        if (majorVersion < 3) {
            throw new Error(`Tailwind CSS version ${cleanVersion} is not supported. Please upgrade to version 3.0 or higher.`);
        }

        return cleanVersion;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid package.json file');
        }
        throw error;
    }
}

/**
 * Check if the installed Tailwind CSS version is 4.x
 * This is required because Tailwind CSS doesn't use config files.
 * @param projectRoot - Optional project root path to locate package.json
 * @returns boolean indicating if Tailwind CSS version is 4.x
 */
export function isTailwindV4(projectRoot?: string): boolean {
    const version = getTailwindVersion(projectRoot);
    return version.startsWith('4.');
}