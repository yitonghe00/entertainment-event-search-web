import { Component, OnInit } from "@angular/core";
import { ResultsService } from "./shared/results.service";
import { FavoritesService } from "./shared/favorites.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  loadedPage;

  constructor(
    private resultsService: ResultsService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadedPage = "results";
    if (localStorage.getItem("fav")) {
      this.favoritesService.results = JSON.parse(localStorage.getItem("fav"));
    }
  }

  onChangePage(page: string) {
    this.loadedPage = page;
  }

  onResetList() {
    this.resultsService.resultsState.list = "end";
    this.resultsService.resultsState.details = "begin";
    this.resultsService.display.display = "list";
    this.loadedPage = "results";
  }
}
