import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { TailwindPackageVersionDetector } from '../../../core/package-detection';
import { Logger } from '../../../util';

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
}));

vi.mock('../../../util', () => ({
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
        describe('error logging', () => {
            it('should log error when package.json is not found', () => {
                mockExistsSync.mockReturnValue(false);

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
                    expect.stringContaining('package.json not found')
                );
            });

            it('should log error for invalid package.json', () => {
                mockReadFileSync.mockReturnValue('invalid json');

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
                    expect.stringContaining('Invalid package.json file')
                );
            });

            it('should log error for invalid version format', () => {
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

            it('should not log error for successful version detection', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: '^3.4.7' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                detector.getTailwindVersionIfGreaterThanMinimum();

                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('should not log error when version is below minimum', () => {
                const mockPackageJson = {
                    dependencies: { tailwindcss: '2.2.19' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                detector.getTailwindVersionIfGreaterThanMinimum();

                expect(mockLoggerError).not.toHaveBeenCalled();
            });

            it('should not log error when tailwindcss is not installed', () => {
                const mockPackageJson = {
                    dependencies: { react: '^18.0.0' },
                };
                mockReadFileSync.mockReturnValue(
                    JSON.stringify(mockPackageJson)
                );

                const detector = new TailwindPackageVersionDetector(
                    '/test/project'
                );
                detector.getTailwindVersionIfGreaterThanMinimum();

                expect(mockLoggerError).not.toHaveBeenCalled();
            });
        });
    });
});
