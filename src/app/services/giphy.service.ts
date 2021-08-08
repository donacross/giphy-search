import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GIFObject, MultiResponse } from 'giphy-api';
import { GIPHY_API_KEY } from 'secrets';
import { GIPHY_SEARCH_URL } from '../utils/giphy.util';

/**
 * @doc https://developers.giphy.com/docs/api/endpoint#search
 */
export type GiphySearchArgs = {
    /** Search query term or phrase. */
    q: string,
    /** The maximum number of objects to return. (Default: 25). */
    limit?: number,
    /** Specifies the starting position of the results.(Default: 0, Max: 4999) */
    offset?: number
    /** Filters results by specified rating. Not specifying it end up with all possible ratings. */
    rating?: 'g' | 'pg' | 'pg-13' | 'r',
    /** Specify default language for regional content; use a 2-letter ISO 639-1 language code. */
    lang?: string,
    /** An ID/proxy for a specific user. */
    randomId?: string,
};

// Interface the Giphy API types in case of a later extension.
export type Gif = GIFObject;

export type GiphySearchResponse = MultiResponse;

@Injectable({
    providedIn: 'root'
})
export class GiphyService {

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * @doc https://developers.giphy.com/docs/api/endpoint#search
     */
    search({
        q,
        limit,
        offset,
        rating,
        lang,
        randomId,
    }: GiphySearchArgs): Promise<GiphySearchResponse> {

        const params: any = {
            api_key: GIPHY_API_KEY,
            q,
        };

        if (limit) params.limit = limit;
        if (offset) params.offset = offset;
        if (rating) params.rating = rating;
        if (lang) params.lang = lang;
        if (randomId) params.random_id = randomId;

        return this.http.get<GiphySearchResponse>(GIPHY_SEARCH_URL, { params }).toPromise();
    }
}
