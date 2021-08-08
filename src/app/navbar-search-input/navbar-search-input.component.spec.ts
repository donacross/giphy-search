import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { QueryParamService } from '../services/query-param.service';
import { NavbarSearchInputComponent, SEARCH_INPUT_DEBOUNCE_TIME } from './navbar-search-input.component';

let QueryParamServiceSpy: jasmine.SpyObj<QueryParamService>;
let RouterSpy: jasmine.SpyObj<Router>;

describe('NavbarSearchInputComponent', () => {
    let NavbarSearchInput: NavbarSearchInputComponent;
    let fixture: ComponentFixture<NavbarSearchInputComponent>;
    const spyQueryParam = jasmine.createSpyObj('QueryParamService', ['set', 'getQ$']) as jasmine.SpyObj<QueryParamService>;
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']) as jasmine.SpyObj<Router>;

    spyQueryParam.getQ$.and.returnValue(of('q test'));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                NavbarSearchInputComponent,
            ],
            providers: [
                { provide: QueryParamService, useValue: spyQueryParam },
                { provide: Router, useValue: spyRouter },
            ],
        })
            .compileComponents();

        QueryParamServiceSpy = TestBed.inject(QueryParamService) as jasmine.SpyObj<QueryParamService>;
        RouterSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarSearchInputComponent);
        NavbarSearchInput = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(NavbarSearchInput).toBeTruthy();
    });

    it('should retrieve the query from the url', () => {
        expect(NavbarSearchInput.control.value).toBe('q test');
    });

    it('should wait a certain amount of time before updating the url', (done: DoneFn) => {
        const { set } = QueryParamServiceSpy;
        set.calls.reset();
        NavbarSearchInput.control.setValue('hello you');
        expect(set).not.toHaveBeenCalled();
        setTimeout(() => {
            expect(set).toHaveBeenCalledOnceWith('q', 'hello you');
            done();
        }, SEARCH_INPUT_DEBOUNCE_TIME * 1.1);
    });

    it('navigates to the search page whenever the user is searching', (done: DoneFn) => {
        const { navigate } = RouterSpy;
        navigate.calls.reset();
        NavbarSearchInput.control.setValue('navigate please');
        setTimeout(() => {
            expect(navigate).toHaveBeenCalledOnceWith(['/search'], { queryParamsHandling: 'merge' });
            done();
        }, SEARCH_INPUT_DEBOUNCE_TIME * 1.1);
    });

    describe('reset()', () => {

        it('erases the input', () => {
            NavbarSearchInput.control.setValue('cats');
            expect(NavbarSearchInput.control.value).toBe('cats');
            NavbarSearchInput.reset();
            expect(NavbarSearchInput.control.value).toBe('');
        });

        it('focuses on the input', () => {
            const focus = spyOn(NavbarSearchInput.input.nativeElement, 'focus');
            expect(focus).not.toHaveBeenCalled();
            NavbarSearchInput.reset();
            expect(focus).toHaveBeenCalled();
        });
    });
});
