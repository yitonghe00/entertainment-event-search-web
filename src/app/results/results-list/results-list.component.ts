import { Component, OnInit } from "@angular/core";
import { ResultsService } from "src/app/shared/results.service";

@Component({
  selector: "app-results-list",
  templateUrl: "./results-list.component.html",
  styleUrls: ["./results-list.component.css"]
})
export class ResultsListComponent implements OnInit {
  results = [];
  state: { state: string };

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.results = this.resultsService.results;
    this.state = this.resultsService.state;
  }
}
