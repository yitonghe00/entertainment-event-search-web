import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { FavoritesService } from "../shared/favorites.service";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.css"],
  animations: [
    trigger("listDiv", [
      state(
        "begin",
        style({
          transform: "translateX(100%)"
        })
      ),
      state(
        "end",
        style({
          transform: "translateX(0)"
        })
      ),
      transition("begin => end", animate(300))
    ]),
    trigger("detailsDiv", [
      state(
        "begin",
        style({
          transform: "translateX(-100%)"
        })
      ),
      state(
        "end",
        style({
          transform: "translateX(0)"
        })
      ),
      transition("begin => end", animate(300))
    ])
  ]
})
export class FavoritesComponent implements OnInit {
  display: { display: string };
  resultsState;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.display = this.favoritesService.display;
    this.display.display = "list";
    this.resultsState = this.favoritesService.resultsState;
    this.resultsState.list = "end";
    this.resultsState.details = "begin";
  }

  onSwitchToDetails() {
    this.display.display = "details";
    this.resultsState.details = "end";
    this.resultsState.list = "begin";
  }

  onSwitchToList() {
    this.display.display = "list";
    this.resultsState.list = "end";
    this.resultsState.details = "begin";
  }
}
