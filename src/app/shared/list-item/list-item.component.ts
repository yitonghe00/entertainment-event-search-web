import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ResultsService } from "../results.service";
import { HttpService } from "../http.service";
import { FavoritesListComponent } from "src/app/favorites/favorites-list/favorites-list.component";
import { isPlatformServer } from "@angular/common";
import { FavoritesService } from "../favorites.service";

@Component({
  selector: "[app-list-item]",
  templateUrl: "./list-item.component.html",
  styleUrls: ["./list-item.component.css"]
})
export class ListItemComponent implements OnInit {
  @Input()
  result;
  @Input()
  index = 0;
  date: string;
  shortName: string;
  fullName: string;
  catagory: string;
  venue: string;
  matTooltip;
  @Output()
  openEvent = new EventEmitter<any>();
  @Input()
  favList;
  isFav;

  constructor(
    private resultsService: ResultsService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.isFav = this.favoritesService.isFav(this.result.id);
    if (this.result && this.result.dates && this.result.dates.start.localDate) {
      this.date = this.result.dates.start.localDate;
    } else {
      this.date = "N/A";
    }

    if (this.result.name.length > 40) {
      this.shortName =
        this.result.name.substring(0, this.result.name.lastIndexOf(" ", 40)) +
        " ...";
      this.fullName = this.result.name;
    } else {
      this.shortName = this.result.name;
      this.fullName = "";
    }

    if (this.result.classifications && this.result.classifications[0]) {
      if (this.result.classifications[0].genre) {
        this.catagory =
          this.result.classifications[0].genre.name +
          " - " +
          this.result.classifications[0].segment.name;
      } else {
        this.catagory = this.result.classifications[0].segment.name;
      }
    } else {
      this.catagory = "N/A";
    }

    if (this.result._embedded.venues[0].name) {
      this.venue = this.result._embedded.venues[0].name;
    } else {
      this.venue = "N/A";
    }
  }

  onClickEvent() {
    // Update data in service
    if (!this.favList) {
      if (
        !this.resultsService.openedEvent.event ||
        this.result.id !== this.resultsService.openedEvent.event.id
      ) {
        this.resultsService.openedEvent.event = this.result;
      }
    } else {
      if (
        !this.favoritesService.openedEvent.event ||
        this.result.id !== this.favoritesService.openedEvent.event.id
      ) {
        this.favoritesService.openedEvent.event = this.result;
      }
    }
    // Switch control
    this.openEvent.emit();
  }

  onAddFav() {
    this.favoritesService.addFav(this.result);
    this.isFav = true;
  }

  onRemoveFav() {
    this.favoritesService.removeFav(this.result.id);
    this.isFav = false;
  }
}
