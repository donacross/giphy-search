import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLikesComponent } from './page-likes/page-likes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageSearchComponent } from './page-search/page-search.component';
import { DEFAULT_URL_SEARCH } from './utils/giphy.util';

const routes: Routes = [
    { path: 'search', component: PageSearchComponent },
    { path: 'likes', component: PageLikesComponent },
    { path: '', redirectTo: DEFAULT_URL_SEARCH, pathMatch: 'full', },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
