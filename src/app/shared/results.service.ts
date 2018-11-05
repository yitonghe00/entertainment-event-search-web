import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  results = [];
  state: { state: string } = { state: "clear" };

  constructor() {}

  setResults(data) {
    if (data["_embedded"]) {
      this.results.length = 0;
      data["_embedded"]["events"].forEach(item => {
        this.results.push(item);
      });
      this.state.state = "results";
    } else {
      this.results.length = 0;
      this.state.state = "none";
    }
  }

  clearResults() {
    this.results.length = 0;
    this.state.state = "clear";
  }

  setErrorState() {
    this.results.length = 0;
    this.state.state = "error";
  }
}
