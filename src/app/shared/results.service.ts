import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  results = [];
  state: { state: string } = { state: "clear" };
  openedEvent: {
    event;
    detail;
    artist;
    venue;
    upcoming;
  } = { event: null, detail: null, artist: null, venue: null, upcoming: null };
  openedTab: { tab: string } = { tab: "event" };
  display: { display: string } = { display: "" };
  resultsState: {
    list: string;
    details: string;
  } = {
    list: "",
    details: ""
  };
  selectOption = {
    keyOption: "default",
    sortOption: "ascending"
  };

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
    this.openedEvent.event = null;
  }

  setNoneState() {
    this.results.length = 0;
    this.state.state = "none";
  }
}
