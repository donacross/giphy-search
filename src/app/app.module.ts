import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GifItemComponent } from './gif-item/gif-item.component';
import { GifListComponent } from './gif-list/gif-list.component';
import { GifPaginationComponent } from './gif-pagination/gif-pagination.component';
import { NavbarSearchInputComponent } from './navbar-search-input/navbar-search-input.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageLikesComponent } from './page-likes/page-likes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageSearchComponent } from './page-search/page-search.component';

@NgModule({
  declarations: [
    AppComponent,
    GifListComponent,
    GifItemComponent,
    GifPaginationComponent,
    PageSearchComponent,
    PageLikesComponent,
    PageNotFoundComponent,
    NavbarComponent,
    NavbarSearchInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
