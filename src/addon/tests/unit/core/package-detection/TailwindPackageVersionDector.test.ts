import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { TailwindPackageVersionDetector } from '../../../../core/package-detection';
import { Logger } from '../../../../util';

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
}));

vi.mock('../../../../util', () => ({
    Logger: {
        error: vi.fn(),
    },
}));

const mockReadFileSync = vi.mocked(readFileSync);
const mockExistsSync = vi.mocked(existsSync);
const mockLoggerError = vi.mocked(Logger.error);

describe('TailwindPackageVersionDetector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockExistsSync.mockReturnValue(true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getTailwindVersionIfGreaterThanMinimum', () => {
        describe('error scenarios', () => {
            it('logs error when package.json is not found', () => {
                mockExistsSync.mockReturnValue(false);

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining(
                        'Unable to detect Tailwind CSS installation'
                    )
                );
                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining('package.json not found')
                );
            });

            it('logs error for invalid package.json', () => {
                mockReadFileSync.mockReturnValue('invalid json');
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining(
                        'Unable to detect Tailwind CSS installation'
                    )
                );
                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining('Invalid package.json file')
                );
            });

            it('logs error for invalid version format', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: 'invalid-version' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                detector.getTailwindVersionIfGreaterThanMinimum();

                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining(
                        'Unable to detect Tailwind CSS installation'
                    )
                );
                expect(mockLoggerError).toHaveBeenCalledWith(
                    expect.stringContaining('Invalid version format')
                );
            });
        });

        describe('valid detection', () => {
            it('returns major version when tailwindcss is in dependencies', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: '^3.4.7' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBe(3);
                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('returns major version when tailwindcss is in devDependencies', () => {
                const mockPackageJson = {
                    devDependencies: { tailwindcss: '~4.0.0' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBe(4);
                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('returns null and does not log error when version is below minimum', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: '2.2.19' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('returns null and does not log error when tailwindcss is not installed', () => {
                const mockPackageJson = { dependencies: { react: '^18.0.0' } };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('returns null and does not log error for empty dependencies', () => {
                const mockPackageJson = {
                    dependencies: {},
                    devDependencies: {},
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).not.toHaveBeenCalled();
            });
        });

        describe('edge cases', () => {
            it('handles version string with extra characters', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: '>=3.2.1' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBe(3);
                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('handles missing dependencies and devDependencies', () => {
                const mockPackageJson = {};
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );
                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                const result =
                    detector.getTailwindVersionIfGreaterThanMinimum();
                expect(result).toBeNull();
                expect(mockLoggerError).not.toHaveBeenCalled();
            });
        });
    });
});
