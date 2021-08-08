import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Gif } from '../services/giphy.service';

@Component({
    selector: 'gif-list',
    templateUrl: './gif-list.component.html',
    styleUrls: ['./gif-list.component.scss']
})
export class GifListComponent {

    constructor() { }

    @Input() gifs$?: Observable<Gif[]>;

}
