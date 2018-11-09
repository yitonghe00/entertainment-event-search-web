import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FavoritesService } from "src/app/shared/favorites.service";

@Component({
  selector: "app-favorites-list",
  templateUrl: "./favorites-list.component.html",
  styleUrls: ["./favorites-list.component.css"]
})
export class FavoritesListComponent implements OnInit {
  results = [];
  state: { state: string };
  @Output()
  switchToDetails = new EventEmitter<any>();
  openedEvent;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.results = this.favoritesService.results;
    this.state = this.favoritesService.state;
    this.openedEvent = this.favoritesService.openedEvent;
  }

  onSwitchToDetails() {
    this.switchToDetails.emit();
  }
}
