import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QueryParamService } from '../services/query-param.service';
import { OFFSET_MAX, OFFSET_MIN } from '../utils/giphy.util';
import { GifPaginationComponent } from './gif-pagination.component';

let QueryParamServiceSpy: jasmine.SpyObj<QueryParamService>;

const setupOffsetAndLimit = (offset: number, limit: number) => {
    const { getValidOffsetOrDefault, getValidLimitOrDefault } = QueryParamServiceSpy;
    getValidOffsetOrDefault.and.resolveTo(offset);
    getValidLimitOrDefault.and.resolveTo(limit);
};

describe('GifPaginationComponent', () => {
    let GifPagination: GifPaginationComponent;
    let fixture: ComponentFixture<GifPaginationComponent>;

    const spyQueryParam = jasmine.createSpyObj('QueryParamService', [
        'getLimit$',
        'set',
        'getQ$',
        'getValidOffsetOrDefault',
        'getValidLimitOrDefault',
    ]) as jasmine.SpyObj<QueryParamService>;

    spyQueryParam.getLimit$.and.returnValue(of('limit test'));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GifPaginationComponent],
            providers: [
                { provide: QueryParamService, useValue: spyQueryParam },
            ],
        })
            .compileComponents();

        QueryParamServiceSpy = TestBed.inject(QueryParamService) as jasmine.SpyObj<QueryParamService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GifPaginationComponent);
        GifPagination = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(GifPagination).toBeTruthy();
    });

    it('init the current page to 1', () => {
        expect(GifPagination.currentPage).toBe(1);
    });

    it('init the total amount of pages to 1', () => {
        expect(GifPagination.totalPages).toBe(1);
    });

    describe('@Input() pagination', () => {

        beforeEach(() => {
            GifPagination.limit = 25;
        });

        it('computes the Giphy pagination result into current and total pages', () => {
            GifPagination.pagination = { count: 25, total_count: 100, offset: 50 };
            const { currentPage, totalPages } = GifPagination;
            expect(currentPage).toBe(3);
            expect(totalPages).toBe(4);
        });

        it('can\'t have a total page beyond the Giphy authorized offset', () => {
            GifPagination.pagination = { count: 25, total_count: 1e20, offset: 50 };
            const { totalPages } = GifPagination;
            expect(totalPages).toBe(200);
        });

        it('ignores null values', () => {
            GifPagination.pagination = { count: 75, total_count: 100, offset: 25 };
            const { currentPage, totalPages } = GifPagination;
            GifPagination.pagination = null;
            expect(currentPage).toBe(GifPagination.currentPage);
            expect(totalPages).toBe(GifPagination.totalPages);
        });
    });

    describe('onChangeLimit()', () => {
        it('sets the "limit" query parameter with the new value', () => {
            GifPagination.onChangeLimit(39);
            expect(QueryParamServiceSpy.set).toHaveBeenCalledWith('limit', 39);
        });
    });

    describe('onClickOnPrevious()', () => {

        beforeEach(() => {
            QueryParamServiceSpy.set.calls.reset();
        });

        it('calculates the new offset and update its value in url', async () => {
            const offset = 51;
            const limit = 23;
            setupOffsetAndLimit(offset, limit);
            await GifPagination.onClickOnPrevious();
            expect(QueryParamServiceSpy.set).toHaveBeenCalledWith('offset', offset - limit);
        });

        it('calculates the new offset without going below its minimum value', async () => {
            const offset = OFFSET_MIN + 20;
            const limit = 50;
            setupOffsetAndLimit(offset, limit);
            await GifPagination.onClickOnPrevious();
            expect(QueryParamServiceSpy.set).toHaveBeenCalledWith('offset', OFFSET_MIN);
        });

        it('deducts the new current page', async () => {
            GifPagination.currentPage = 2;
            await GifPagination.onClickOnPrevious();
            expect(GifPagination.currentPage).toBe(1);
            await GifPagination.onClickOnPrevious();
            expect(GifPagination.currentPage).toBe(1);
        });
    });

    describe('onClickOnNext()', () => {

        beforeEach(() => {
            QueryParamServiceSpy.set.calls.reset();
        });

        it('calculates the new offset and update its value in url', async () => {
            const offset = 51;
            const limit = 23;
            setupOffsetAndLimit(offset, limit);
            await GifPagination.onClickOnNext();
            expect(QueryParamServiceSpy.set).toHaveBeenCalledWith('offset', offset + limit);
        });

        it('calculates the new offset without exceeding its maximum value', async () => {
            const offset = OFFSET_MAX - 20;
            const limit = 50;
            setupOffsetAndLimit(offset, limit);
            await GifPagination.onClickOnNext();
            expect(QueryParamServiceSpy.set).toHaveBeenCalledWith('offset', OFFSET_MAX);
        });

        it('deducts the new current page', async () => {
            GifPagination.currentPage = 199;
            GifPagination.totalPages = 200;
            await GifPagination.onClickOnNext();
            expect(GifPagination.currentPage).toBe(200);
            await GifPagination.onClickOnNext();
            expect(GifPagination.currentPage).toBe(200);
        });
    });
});
