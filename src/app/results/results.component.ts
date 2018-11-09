import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { ResultsService } from "../shared/results.service";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"],
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
export class ResultsComponent implements OnInit {
  display: { display: string };
  resultsState;

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.display = this.resultsService.display;
    this.display.display = "list";
    this.resultsState = this.resultsService.resultsState;
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
