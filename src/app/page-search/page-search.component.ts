import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { Gif, GiphySearchArgs, GiphySearchResponse, GiphyService } from '../services/giphy.service';
import { Pagination, validateQueryParams } from '../utils/giphy.util';

@Component({
    selector: 'page-search',
    templateUrl: './page-search.component.html',
    styleUrls: ['./page-search.component.scss']
})
export class PageSearchComponent implements OnInit {

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private Giphy: GiphyService,
    ) { }

    gifs$!: Observable<Gif[]>;

    response$!: Observable<GiphySearchResponse>;

    pagination$!: Observable<Pagination>;

    isValidSearch$!: Observable<boolean>;

    isQueryEmpty$!: Observable<boolean>;

    errors$!: Observable<string[]>;

    ngOnInit(): void {
        const queryParams$ = this.ActivatedRoute.queryParams;

        this.isQueryEmpty$ = queryParams$.pipe(
            pluck('q'),
            map(q => q === undefined || q === ''),
        );

        const validation$ = queryParams$.pipe(
            map(x => validateQueryParams(x)),
        );

        this.isValidSearch$ = validation$.pipe(pluck('isValid'));

        this.errors$ = validation$.pipe(pluck('errors'));

        this.response$ = validation$.pipe(
            filter(({ isValid }) => isValid),
            switchMap(({ queryParams }) => {
                return this.Giphy.search(queryParams as GiphySearchArgs);
            }),
        );

        this.gifs$ = this.response$.pipe(
            map(res => res.data),
        );

        this.pagination$ = this.response$.pipe(
            map(res => res.pagination),
        );
    }

}
