import { assertLimit, assertOffset, assertQ, LIMIT_MAX, LIMIT_MIN, OFFSET_MAX, OFFSET_MIN, validateLimit, validateOffset, validateQ, validateQueryParams } from "./giphy.util";


describe('giphy.util', () => {

    describe('assertQ()', () => {

        it('asserts q to be a string', () => {
            expect(() => assertQ(42)).toThrow();
            expect(() => assertQ('cactus')).not.toThrow();
        });

        it('asserts q to not be an empty string', () => {
            expect(() => assertQ('')).toThrow();
            expect(() => assertQ('    ')).toThrow();
            expect(() => assertQ('   cake   ')).not.toThrow();
        });
    });

    describe('assertLimit()', () => {

        it('asserts limit to be a number', () => {
            expect(() => assertLimit('50')).toThrow();
            expect(() => assertLimit(50)).not.toThrow();
        });

        it('asserts limit to greater or equal to its minimum', () => {
            expect(() => assertLimit(LIMIT_MIN + 1)).not.toThrow();
            expect(() => assertLimit(LIMIT_MIN)).not.toThrow();
            expect(() => assertLimit(LIMIT_MIN - 1)).toThrow();
        });

        it('asserts limit to lower or equal to its maximum', () => {
            expect(() => assertLimit(LIMIT_MAX - 1)).not.toThrow();
            expect(() => assertLimit(LIMIT_MAX)).not.toThrow();
            expect(() => assertLimit(LIMIT_MAX + 1)).toThrow();
        });
    });

    describe('assertOffset()', () => {

        it('asserts offset to be a number', () => {
            expect(() => assertOffset('50')).toThrow();
            expect(() => assertOffset(50)).not.toThrow();
        });

        it('asserts offset to greater or equal to its minimum', () => {
            expect(() => assertOffset(OFFSET_MIN + 1)).not.toThrow();
            expect(() => assertOffset(OFFSET_MIN)).not.toThrow();
            expect(() => assertOffset(OFFSET_MIN - 1)).toThrow();
        });

        it('asserts offset to lower or equal to its maximum', () => {
            expect(() => assertOffset(OFFSET_MAX - 1)).not.toThrow();
            expect(() => assertOffset(OFFSET_MAX)).not.toThrow();
            expect(() => assertOffset(OFFSET_MAX + 1)).toThrow();
        });
    });

    describe('validateQ()', () => {

        it('returns true if q is valid', () => {
            expect(validateQ('cat')).toBe(true);
        });

        it('returns false if q is invalid', () => {
            expect(validateQ(50)).toBe(false);
        });
    });

    describe('validateLimit()', () => {

        it('returns true if limit is valid', () => {
            expect(validateLimit(25)).toBe(true);
        });

        it('returns false if limit is invalid', () => {
            expect(validateLimit('25')).toBe(false);
        });
    });

    describe('validateOffset()', () => {

        it('returns true if limit is valid', () => {
            expect(validateOffset(8)).toBe(true);
        });

        it('returns false if limit is invalid', () => {
            expect(validateOffset('8')).toBe(false);
        });
    });

    describe('validateQueryParams()', () => {

        it('validates all params at once', () => {
            const queryParams = { q: 'cat', limit: 0, offset: 0 };
            expect(validateQueryParams(queryParams)).toEqual({ isValid: true, errors: [], queryParams });
        });

        it('invalidates when at least one param is invalid', () => {
            const queryParams = { q: '', limit: 0, offset: 0 };
            expect(validateQueryParams(queryParams).isValid).toBe(false);
        });

        it('cast limit and offset to numbers as long as they\'re not undefined', () => {
            const queryParams = { q: 'cat', limit: '0' };
            expect(validateQueryParams(queryParams as any).isValid).toBe(true);
        });

        it('returns an error for each invalid param', () => {
            const errors = validateQueryParams({ q: 'cat', limit: -1, offset: -1 }).errors;
            expect(errors).toHaveSize(2);
        });
    });
});