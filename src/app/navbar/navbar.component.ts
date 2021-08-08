import { Component } from '@angular/core';
import { DEFAULT_SEARCH_QUERY_PARAMS } from '../utils/giphy.util';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor() { }

  DEFAULT_SEARCH_QUERY_PARAMS = DEFAULT_SEARCH_QUERY_PARAMS;

}
