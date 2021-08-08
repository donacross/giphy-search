import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLikesComponent } from './page-likes.component';


describe('PageLikesComponent', () => {
    let component: PageLikesComponent;
    let fixture: ComponentFixture<PageLikesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageLikesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageLikesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
