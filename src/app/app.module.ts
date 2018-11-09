import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule, MatTooltipModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { RoundProgressModule } from "angular-svg-round-progressbar";
import { AgmCoreModule } from "@agm/core";

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
import { DisableControlDirective } from "./search-form/disable-control.directive";
import { ResultsService } from "./shared/results.service";
import { ArraySortPipe } from "./shared/details/upcoming-detail/array-sort.pipe";
import { FavoritesService } from "./shared/favorites.service";

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
    DisableControlDirective,
    ArraySortPipe
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
    MatTooltipModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    RoundProgressModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDb7GELau72-aTrK6OF6auplZxv5xQzFoA"
    })
  ],
  providers: [ResultsService, FavoritesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
