import { describe, expect, it } from 'vitest';
import { ParsedTheme } from '../../../../../core/theme-loader/parsers';

describe('ParsedTheme', () => {
    describe('isDefaultOverridden', () => {
        it('returns false when neither global nor namespace reset is present', () => {
            const variables = { color: { blue: '#00f' } };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden()).toBe(false);
            expect(parsedTheme.isDefaultOverridden('color')).toBe(false);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns true for global reset only', () => {
            const variables = {
                '*': { '*': 'initial' },
                color: { blue: '#00f' },
            };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden()).toBe(true);
            expect(parsedTheme.isDefaultOverridden('color')).toBe(false);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns true for namespace reset only', () => {
            const variables = { color: { '*': 'initial', blue: '#00f' } };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden()).toBe(false);
            expect(parsedTheme.isDefaultOverridden('color')).toBe(true);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns true for both global and namespace reset', () => {
            const variables = {
                '*': { '*': 'initial' },
                color: { '*': 'initial', blue: '#00f' },
            };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden()).toBe(true);
            expect(parsedTheme.isDefaultOverridden('color')).toBe(true);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns false for unknown namespace when only namespace reset is present', () => {
            const variables = { color: { '*': 'initial', blue: '#00f' } };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns false for unknown namespace when only global reset is present', () => {
            const variables = {
                '*': { '*': 'initial' },
                color: { blue: '#00f' },
            };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });

        it('returns false for unknown namespace when both resets are present', () => {
            const variables = {
                '*': { '*': 'initial' },
                color: { '*': 'initial', blue: '#00f' },
            };
            const parsedTheme = new ParsedTheme(variables);
            expect(parsedTheme.isDefaultOverridden('font')).toBe(false);
        });
    });
});
