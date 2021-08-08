import { QueryParams } from "../services/query-param.service";

export const GIPHY_SEARCH_URL = 'https://api.giphy.com/v1/gifs/search?';

export const LIMIT_VALUES = [10, 25, 50];
export const LIMIT_DEFAULT = 50;
export const LIMIT_MIN = 0;
export const LIMIT_MAX = 50;

export const OFFSET_DEFAULT = 0;
export const OFFSET_MIN = 0;
export const OFFSET_MAX = 4999;

export const Q_DEFAULT = 'welcome';

export const DEFAULT_URL_SEARCH = `/search?q=${Q_DEFAULT}&limit=${LIMIT_DEFAULT}&offset=${OFFSET_DEFAULT}`;

export const DEFAULT_SEARCH_QUERY_PARAMS = {
    q: Q_DEFAULT,
    limit: LIMIT_DEFAULT,
    offset: OFFSET_DEFAULT,
};


/**
 * The Pagination Object contains information relating to the number of total results available
 * as well as the number of results fetched and their relative positions.
 *
 * @doc https://developers.giphy.com/docs/api/schema#pagination-object
 */

export type Pagination = {
    /** Total number of items available (not returned on every endpoint). */
    total_count: number;
    /** Total number of items returned. */
    count: number;
    /** Position in pagination. */
    offset: number;
};

export function assertQ(q: any): asserts q is string {

    if (typeof q !== 'string') {
        throw new Error(`"q" must be a string. Got "${typeof q}".`);
    }

    if (q.trim() === '') {
        throw new Error(`"q" can't be empty. Got "${q}".`);
    }
}

export function assertLimit(limit: any): asserts limit is number {

    if (typeof limit !== 'number') {
        throw new Error(`"limit" must be a number. Got "${typeof limit}".`);
    }

    if (limit < LIMIT_MIN) {
        throw new Error(`"limit" must be greater or equal to ${LIMIT_MIN}. Got "${limit}".`);
    }

    if (limit > LIMIT_MAX) {
        throw new Error(`"limit" must be lower or equal to ${LIMIT_MAX}. Got "${limit}".`);
    }
}

export function assertOffset(offset: any): asserts offset is number {

    if (typeof offset !== 'number') {
        throw new Error(`"offset" must be a number. Got "${typeof offset}".`);
    }

    if (offset < OFFSET_MIN) {
        throw new Error(`"offset" must be greater or equal to ${OFFSET_MIN}. Got "${offset}".`);
    }

    if (offset > OFFSET_MAX) {
        throw new Error(`"offset" must be lower or equal to ${OFFSET_MAX}. Got "${offset}".`);
    }
}

export function validateQ(q: any): boolean {
    try {
        assertQ(q);
    } catch (error) {
        return false;
    }
    return true;
}

export function validateLimit(limit: any): boolean {
    try {
        assertLimit(limit);
    } catch (error) {
        return false;
    }
    return true;
}

export function validateOffset(offset: any): boolean {
    try {
        assertOffset(offset);
    } catch (error) {
        return false;
    }
    return true;
}

export type ValidateQueryParamsResult = {
    isValid: boolean,
    errors: string[],
    queryParams: QueryParams,
};

export function validateQueryParams(queryParams: QueryParams): ValidateQueryParamsResult {

    let isValid = true;
    const errors: string[] = [];
    const { q, limit, offset } = queryParams;

    try {
        assertQ(q);
    } catch (e) {
        isValid = false;
        errors.push(e);
    }

    if (limit !== undefined) {
        try {
            assertLimit(+limit);
        } catch (e) {
            isValid = false;
            errors.push(e);
        }
    }

    if (offset !== undefined) {
        try {
            assertOffset(+offset);
        } catch (e) {
            isValid = false;
            errors.push(e);
        }
    }

    return {
        isValid,
        errors,
        queryParams,
    };
}