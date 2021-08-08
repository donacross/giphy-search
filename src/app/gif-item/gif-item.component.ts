import { Component, Input } from '@angular/core';
import { Gif } from '../services/giphy.service';

@Component({
    selector: 'gif-item',
    templateUrl: './gif-item.component.html',
    styleUrls: ['./gif-item.component.scss']
})
export class GifItemComponent {

    constructor() { }

    @Input() gif?: Gif;

    /**
     * @doc https://developers.giphy.com/docs/optional-settings#rendition-guide
     */
    getSrc({ images }: Gif) {

        // 1. fixed_width_downsampled
        //
        // Downsampled to six frames for faster-loading unlimited scroll preview grids.
        //
        if (images.fixed_width_downsampled) {
            const { webp, url } = images.fixed_width_downsampled;
            return webp ? webp : url;
        }

        console.warn(`downsampled missing `, images);

        // 2. fixed_width_small
        //
        // Width set to 100px, variable height. Good for smaller screen sizes with preview grids.
        //
        if (images.fixed_width_small) {
            const { webp, url } = images.fixed_width_small;
            return webp ? webp : url;
        }

        console.warn(`small missing`, images);

        // 3. fixed_width
        //
        // Width set to 200px, variable height, to fit in preview grids and other smaller applications.
        //
        if (images.fixed_width) {
            const { webp, url } = images.fixed_width;
            return webp ? webp : url;
        }

        console.error(images);
        throw new Error("Missing fixed_width");
    }

}
