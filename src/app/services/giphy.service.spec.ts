import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GIPHY_API_KEY } from 'secrets';
import { GIPHY_SEARCH_URL } from '../utils/giphy.util';
import { GiphyService } from './giphy.service';

let Giphy: GiphyService;
let HttpClientSpy: jasmine.SpyObj<HttpClient>;

describe('GiphyService', () => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GiphyService,
                { provide: HttpClient, useValue: spyHttpClient },
            ],
        });
        Giphy = TestBed.inject(GiphyService);
        HttpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {
        expect(Giphy).toBeTruthy();
    });

    describe('search()', () => {
        it('uses HttpClient.get() to call the Giphy API', async () => {
            const get = HttpClientSpy.get;
            const getResult = { what: 'ever' };
            get.and.returnValue(of(getResult));
            expect(await Giphy.search({ q: 'bali' })).toBe(getResult as any);
            const [arg1, arg2] = get.calls.first().args;
            expect(arg1).toBe(GIPHY_SEARCH_URL);
            expect(arg2).toEqual({
                params: {
                    q: 'bali',
                    api_key: GIPHY_API_KEY,
                },
            });
        });
    });
});
