import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../utils/giphy.util';
import { QueryParamService } from './query-param.service';

let RouterSpy: jasmine.SpyObj<Router>;
const routeQueryParams = {
    q: 'q route',
    limit: 'limit route',
    offset: 'offset route',
};
const ActivatedRouteMock: Partial<ActivatedRoute> = {
    queryParams: of(routeQueryParams),
};

describe('QueryParamService', () => {
    let QueryParam: QueryParamService;
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']) as jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: spyRouter },
                { provide: ActivatedRoute, useValue: ActivatedRouteMock },
            ],
        });
        QueryParam = TestBed.inject(QueryParamService);
        RouterSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should be created', () => {
        expect(QueryParam).toBeTruthy();
    });

    describe('setAll()', () => {
        it('uses Angular Router to set multiple query parameters', () => {
            const params = { q: 'test', limit: 1, offset: 2 }
            QueryParam.setAll(params);
            expect(RouterSpy.navigate.calls.count()).toBe(1);
            const args = RouterSpy.navigate.calls.first().args;
            expect(args[0]).toEqual([]);
            expect(args[1]).toEqual({
                relativeTo: ActivatedRouteMock as ActivatedRoute,
                queryParams: params,
                queryParamsHandling: 'merge',
            });
        });
    });

    describe('set()', () => {
        it('uses setAll()', () => {
            const setAll = spyOn(QueryParam, 'setAll');
            QueryParam.set('q', 'banana');
            expect(setAll).toHaveBeenCalled();
            const firstArg = setAll.calls.argsFor(0)[0];
            expect(firstArg).toEqual({ q: 'banana' });
        });
    });

    describe('getAll()', () => {
        it('returns all query parameters of the current route', async () => {
            expect(await QueryParam.getAll()).toEqual(routeQueryParams as any);
        });
    });

    describe('get()', () => {
        it('returns the requested query parameter of the current route', async () => {
            expect(await QueryParam.get('q')).toBe(routeQueryParams.q);
        });
        it('uses getAll()', async () => {
            const getAll = spyOn(QueryParam, 'getAll').and.returnValue(Promise.resolve({}));
            await QueryParam.get('q');
            expect(getAll).toHaveBeenCalled();
        });
    });

    describe('getValidLimitOrDefault()', () => {
        it('returns the "limit" query parameter as a number if valid', async () => {
            spyOn(QueryParam, 'get').and.returnValue(Promise.resolve('25'));
            expect(await QueryParam.getValidLimitOrDefault()).toBe(25);
        });
        it('returns the default "limit" if its query parameter is invalid', async () => {
            spyOn(QueryParam, 'get').and.returnValue(Promise.resolve('100'));
            expect(await QueryParam.getValidLimitOrDefault()).toBe(LIMIT_DEFAULT);
        });
    });

    describe('getValidOffsetOrDefault()', () => {
        it('returns the "offset" query parameter as a number if valid', async () => {
            spyOn(QueryParam, 'get').and.returnValue(Promise.resolve('450'));
            expect(await QueryParam.getValidOffsetOrDefault()).toBe(450);
        });
        it('returns the default "offset" if its query parameter is invalid', async () => {
            spyOn(QueryParam, 'get').and.returnValue(Promise.resolve('5000'));
            expect(await QueryParam.getValidOffsetOrDefault()).toBe(OFFSET_DEFAULT);
        });
    });

    describe('getQ$()', () => {
        it('returns the query parameter "q" as an observable', (done: DoneFn) => {
            QueryParam.getQ$().subscribe(q => {
                expect(q).toBe('q route');
                done();
            });
        });
    });

    describe('getLimit$()', () => {
        it('returns the query parameter "limit" as an observable', (done: DoneFn) => {
            QueryParam.getLimit$().subscribe(limit => {
                expect(limit).toBe('limit route');
                done();
            });
        });
    });

    describe('getOffset$()', () => {
        it('returns the query parameter "offset" as an observable', (done: DoneFn) => {
            QueryParam.getOffset$().subscribe(offset => {
                expect(offset).toBe('offset route');
                done();
            });
        });
    });
});
