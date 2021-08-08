import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { QueryParamService } from '../services/query-param.service';

export const SEARCH_INPUT_DEBOUNCE_TIME = 300;

@Component({
    selector: 'navbar-search-input',
    templateUrl: './navbar-search-input.component.html',
    styleUrls: ['./navbar-search-input.component.scss']
})
export class NavbarSearchInputComponent implements OnInit {

    constructor(
        private QueryParam: QueryParamService,
        private Router: Router,
    ) { }

    control = new FormControl('');

    @ViewChild('input', { read: ElementRef }) input!: { nativeElement: HTMLInputElement };

    ngOnInit(): void {
        this.control.valueChanges.pipe(
            debounceTime(SEARCH_INPUT_DEBOUNCE_TIME),
            takeUntil(this.destroyed),
        )
            .subscribe(async q => {
                if (q && q !== '') {
                    await this.Router.navigate(['/search'], { queryParamsHandling: 'merge' });
                }
                this.QueryParam.set('q', q);
            });

        this.QueryParam.getQ$().pipe(takeUntil(this.destroyed))
            .subscribe(q => this.control.setValue(q, { onlySelf: true }))
    }

    reset(): void {
        this.control.reset('');
        this.input.nativeElement.focus();
    }

    private destroyed = new Subject();
    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

}
