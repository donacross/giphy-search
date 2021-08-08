import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GiphyService } from '../services/giphy.service';
import { PageSearchComponent } from './page-search.component';

let GiphyServiceSpy: jasmine.SpyObj<GiphyService>;

describe('PageSearchComponent', () => {
    let component: PageSearchComponent;
    let fixture: ComponentFixture<PageSearchComponent>;
    const spyGiphyService = jasmine.createSpyObj('GiphyService', ['search']) as jasmine.SpyObj<GiphyService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageSearchComponent],
            providers: [
                { provide: GiphyService, useValue: spyGiphyService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of([{
                            q: 'q test',
                            limit: 'limit test',
                            offset: 'offset test',
                        }]),
                    },
                },
            ],
        })
            .compileComponents();

        GiphyServiceSpy = TestBed.inject(GiphyService) as jasmine.SpyObj<GiphyService>;

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
