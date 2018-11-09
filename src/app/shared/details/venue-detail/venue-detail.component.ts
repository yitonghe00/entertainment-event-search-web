import { Component, OnInit, Input } from "@angular/core";
import { ResultsService } from "../../results.service";
import { FavoritesService } from "../../favorites.service";

@Component({
  selector: "app-venue-detail",
  templateUrl: "./venue-detail.component.html",
  styleUrls: ["./venue-detail.component.css"]
})
export class VenueDetailComponent implements OnInit {
  openedEvent;
  zoom: number;
  @Input()
  favList;

  constructor(
    private resultsService: ResultsService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    if (!this.favList) {
      this.openedEvent = this.resultsService.openedEvent;
    } else {
      this.openedEvent = this.favoritesService.openedEvent;
    }

    this.zoom = 15;
  }
}
