import { Injectable, OnInit } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FavoritesService {
  results = [];
  state: { state: string } = { state: "clear" };
  openedEvent: {
    event;
    detail;
    artist;
    venue;
    upcoming;
  } = { event: null, detail: null, artist: null, venue: null, upcoming: null };
  openedTab: { tab: string };
  display: { display: string } = { display: "" };
  resultsState: {
    list: string;
    details: string;
  } = {
    list: "",
    details: ""
  };

  constructor() {}

  addFav(newFav) {
    this.results.push(newFav);
    localStorage.setItem("fav", JSON.stringify(this.results));
  }

  removeFav(id: string) {
    // Remove the item from results
    var i = 0;
    for (; i < this.results.length; i++) {
      if (id === this.results[i].id) {
        break;
      }
    }
    this.results.splice(i, 1);
    localStorage.setItem("fav", JSON.stringify(this.results));

    // Close details page
    if (this.openedEvent.detail && this.openedEvent.detail.id === id) {
      this.openedEvent.event.id = null;
    }
  }

  isFav(id: string) {
    for (var i = 0; i < this.results.length; i++) {
      if (id === this.results[i].id) {
        return true;
      }
    }
    return false;
  }
}
