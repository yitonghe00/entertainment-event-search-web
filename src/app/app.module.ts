import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { ResultsComponent } from "./results/results.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { FavoritesListComponent } from "./favorites/favorites-list/favorites-list.component";
import { ResultsListComponent } from "./results/results-list/results-list.component";
import { ListItemComponent } from "./shared/list-item/list-item.component";
import { DetailsComponent } from "./shared/details/details.component";
import { EventDetailComponent } from "./shared/details/event-detail/event-detail.component";
import { ArtistDetailComponent } from "./shared/details/artist-detail/artist-detail.component";
import { VenueDetailComponent } from "./shared/details/venue-detail/venue-detail.component";
import { UpcomingDetailComponent } from "./shared/details/upcoming-detail/upcoming-detail.component";
import { ClickStopPropagationDirective } from "./shared/click-stop-propagation.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { DisableControlDirective } from './search-form/disable-control.directive';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    NavBarComponent,
    ResultsComponent,
    FavoritesComponent,
    FavoritesListComponent,
    ResultsListComponent,
    ListItemComponent,
    DetailsComponent,
    EventDetailComponent,
    ArtistDetailComponent,
    VenueDetailComponent,
    UpcomingDetailComponent,
    ClickStopPropagationDirective,
    DisableControlDirective
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
