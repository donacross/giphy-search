import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { LIMIT_DEFAULT, OFFSET_DEFAULT, validateLimit, validateOffset } from '../utils/giphy.util';

/** Whitelist of query parameters available through the app. */
export type QueryParams = {
    q?: string,
    limit?: number,
    offset?: number,
};

export type QueryParamName = keyof QueryParams;

export type QueryParamValue = string | number;

@Injectable({
    providedIn: 'root'
})
export class QueryParamService {

    constructor(
        private Router: Router,
        private ActivatedRoute: ActivatedRoute,
    ) { }

    setAll(queryParams: QueryParams): void {
        this.Router.navigate(
            [],
            {
                relativeTo: this.ActivatedRoute,
                queryParams,
                queryParamsHandling: 'merge'
            }
        );
    }

    set(name: QueryParamName, value: QueryParamValue): void {
        this.setAll({ [name]: value });
    }

    getAll(): Promise<QueryParams> {
        return this.ActivatedRoute.queryParams.pipe(take(1)).toPromise();
    }

    async get(name: QueryParamName): Promise<QueryParamValue | undefined> {
        const params = await this.getAll();
        return params[name];
    }

    async getValidLimitOrDefault(): Promise<number> {
        const limit = await this.get('limit');
        if (limit !== undefined && validateLimit(+limit)) {
            return +limit;
        }
        return LIMIT_DEFAULT;
    }

    async getValidOffsetOrDefault(): Promise<number> {
        const offset = await this.get('offset');
        if (offset !== undefined && validateOffset(+offset)) {
            return +offset;
        }
        return OFFSET_DEFAULT;
    }

    getQ$(): Observable<string | undefined> {
        return this.ActivatedRoute.queryParams.pipe(pluck('q'));
    }

    getLimit$(): Observable<string | undefined> {
        return this.ActivatedRoute.queryParams.pipe(pluck('limit'));
    }

    getOffset$(): Observable<string | undefined> {
        return this.ActivatedRoute.queryParams.pipe(pluck('offset'));
    }
}
