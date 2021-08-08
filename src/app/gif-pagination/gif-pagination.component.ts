import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QueryParamService } from '../services/query-param.service';
import { LIMIT_DEFAULT, LIMIT_VALUES, OFFSET_DEFAULT, OFFSET_MAX, OFFSET_MIN, Pagination, validateLimit } from '../utils/giphy.util';

@Component({
    selector: 'gif-pagination',
    templateUrl: './gif-pagination.component.html',
    styleUrls: ['./gif-pagination.component.scss'],
})
export class GifPaginationComponent implements OnInit {

    constructor(
        private QueryParam: QueryParamService,
    ) { }

    @Input()
    set pagination(v: Pagination | null) {
        if (v !== null) {
            const { count, total_count, offset } = v;
            const total = total_count > OFFSET_MAX ? OFFSET_MAX : total_count;
            this.currentPage = offset > 0 && count > 0 ? Math.ceil((offset + 1) / this.limit) : 1;
            this.totalPages = total > 0 && count > 0 ? Math.ceil(total / count) : 1;
        }
    }

    currentPage = 1;
    totalPages = 1;
    limitValues = LIMIT_VALUES;
    limit = LIMIT_DEFAULT;
    offset = OFFSET_DEFAULT;

    ngOnInit(): void {
        this.QueryParam.getLimit$()
            .pipe(takeUntil(this.destroyed))
            .subscribe(limit => {
                if (limit && validateLimit(+limit) && LIMIT_VALUES.includes(+limit)) {
                    this.limit = +limit;
                }
            });
    }

    onChangeLimit(newLimit: number): void {
        this.QueryParam.set('limit', newLimit);
    }

    async onClickOnPrevious(): Promise<void> {
        const offset = await this.QueryParam.getValidOffsetOrDefault();
        const limit = await this.QueryParam.getValidLimitOrDefault();

        let newOffset = offset - limit;

        if (newOffset < OFFSET_MIN) {
            newOffset = OFFSET_MIN;
        }

        this.QueryParam.set('offset', newOffset);

        // Optimistic UI
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    async onClickOnNext(): Promise<void> {

        const offset = await this.QueryParam.getValidOffsetOrDefault();
        const limit = await this.QueryParam.getValidLimitOrDefault();

        let newOffset = offset + limit;

        if (newOffset > OFFSET_MAX) {
            newOffset = OFFSET_MAX;
        }

        this.QueryParam.set('offset', newOffset);

        // Optimistic UI
        // Avoid the user to go beyond offset = 4999 by clicking rapidly.
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    private destroyed = new Subject();
    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
