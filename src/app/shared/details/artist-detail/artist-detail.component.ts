import { Component, OnInit, Input } from "@angular/core";

import { ResultsService } from "../../results.service";
import { FavoritesService } from "../../favorites.service";

@Component({
  selector: "app-artist-detail",
  templateUrl: "./artist-detail.component.html",
  styleUrls: ["./artist-detail.component.css"]
})
export class ArtistDetailComponent implements OnInit {
  openedEvent;
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
  }
}
