import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GifItemComponent } from './gif-item.component';


describe('GifItemComponent', () => {
    let component: GifItemComponent;
    let fixture: ComponentFixture<GifItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GifItemComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GifItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
