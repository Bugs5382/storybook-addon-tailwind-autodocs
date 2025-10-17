import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTailwindVersion, isTailwindV4 } from '../detect-version';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Mock fs module
vi.mock('fs', () => ({
    readFileSync: vi.fn()
}));

const mockReadFileSync = vi.mocked(readFileSync);

describe('Tailwind Version Detection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getTailwindVersion', () => {
        it('should detect V3 version from project package.json dependencies', () => {
            const mockProjectRoot = '/test/project';
            const expectedPath = resolve(mockProjectRoot, 'package.json');

            const mockPackageJson = {
                dependencies: {
                    'tailwindcss': '^3.4.7'
                }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

            const version = getTailwindVersion(mockProjectRoot);
            expect(version).toBe('3.4.7');
            expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8');
        });

        it('should detect V4 version from project package.json devDependencies', () => {
            const mockProjectRoot = '/test/project';
            const expectedPath = resolve(mockProjectRoot, 'package.json');

            const mockPackageJson = {
                dependencies: {},
                devDependencies: {
                    'tailwindcss': '~4.0.0-beta.1'
                }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

            const version = getTailwindVersion(mockProjectRoot);
            expect(version).toBe('4.0.0-beta.1');
        });

        it('should handle version ranges correctly', () => {
            const testCases = [
                { input: '^4.0.0', expected: '4.0.0' },
                { input: '~3.4.7', expected: '3.4.7' },
                { input: '>=4.1.0', expected: '4.1.0' },
                { input: '4.0.0-alpha.1', expected: '4.0.0-alpha.1' }
            ];

            testCases.forEach(({ input, expected }) => {
                const mockPackageJson = {
                    dependencies: {
                        'tailwindcss': input
                    }
                };

                mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

                const version = getTailwindVersion('/test/project');
                expect(version).toBe(expected);
            });
        });

        it('should throw error when tailwindcss is not in dependencies', () => {
            const mockPackageJson = {
                dependencies: {
                    'react': '^18.0.0'
                },
                devDependencies: {
                    'typescript': '^5.0.0'
                }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

            expect(() => getTailwindVersion('/test/project')).toThrow(
                'Tailwind CSS is not installed. Please install tailwindcss version 3.0 or higher.'
            );
        });

        it('should throw error for versions less than 3.0', () => {
            const testCases = [
                { version: '2.2.19', description: 'V2 version' },
                { version: '^2.0.0', description: 'V2 with caret' },
                { version: '1.9.6', description: 'V1 version' }
            ];

            testCases.forEach(({ version, description }) => {
                const mockPackageJson = {
                    dependencies: {
                        'tailwindcss': version
                    }
                };

                mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

                expect(() => getTailwindVersion('/test/project')).toThrow(
                    /Tailwind CSS version .* is not supported. Please upgrade to version 3.0 or higher./
                );
            });
        });

        it('should throw error when package.json is not found', () => {
            mockReadFileSync.mockImplementation(() => {
                throw new Error('ENOENT: no such file or directory');
            });

            expect(() => getTailwindVersion('/nonexistent/path')).toThrow(
                'ENOENT: no such file or directory'
            );
        });

        it('should throw error for invalid package.json', () => {
            mockReadFileSync.mockReturnValue('invalid json');

            expect(() => getTailwindVersion('/test/project')).toThrow('Invalid package.json file');
        });

        it('should use process.cwd() when no projectRoot provided', () => {
            const expectedPath = resolve(process.cwd(), 'package.json');

            const mockPackageJson = {
                dependencies: {
                    'tailwindcss': '^3.4.9'
                }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

            const version = getTailwindVersion();
            expect(version).toBe('3.4.9');
            expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8');
        });

        it('should accept V3 minimum version (3.0.0)', () => {
            const mockPackageJson = {
                dependencies: {
                    'tailwindcss': '3.0.0'
                }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

            const version = getTailwindVersion('/test/project');
            expect(version).toBe('3.0.0');
        });
    });

    describe('isTailwindV4', () => {
        it('should return true for V4 versions', () => {
            const mockPackageJson = {
                dependencies: { 'tailwindcss': '^4.0.0' }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
            expect(isTailwindV4()).toBe(true);
        });

        it('should return true for V4 beta versions', () => {
            const mockPackageJson = {
                dependencies: { 'tailwindcss': '4.0.0-beta.1' }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
            expect(isTailwindV4()).toBe(true);
        });

        it('should return false for V3 versions', () => {
            const mockPackageJson = {
                dependencies: { 'tailwindcss': '^3.4.7' }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
            expect(isTailwindV4()).toBe(false);
        });

        it('should throw error when tailwindcss is not installed', () => {
            const mockPackageJson = {
                dependencies: { 'react': '^18.0.0' }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
            expect(() => isTailwindV4()).toThrow(
                'Tailwind CSS is not installed. Please install tailwindcss version 3.0 or higher.'
            );
        });

        it('should throw error for unsupported versions', () => {
            const mockPackageJson = {
                dependencies: { 'tailwindcss': '^2.2.19' }
            };

            mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
            expect(() => isTailwindV4()).toThrow(
                /Tailwind CSS version .* is not supported. Please upgrade to version 3.0 or higher./
            );
        });
    });
});