import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ResultsService } from "../results.service";
import { HttpService } from "../http.service";
import { FavoritesService } from "../favorites.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  tab;
  @Output()
  switchToList = new EventEmitter<any>();
  openedEvent;
  detailDone: boolean;
  artistDone: boolean;
  artistItem: number;
  venueDone: boolean;
  upcomingDone: boolean;
  twitterUrl: string;
  @Input()
  favList: boolean;
  isFav: boolean;
  twitterDone: boolean;
  state;

  constructor(
    private resultsService: ResultsService,
    private favoritesService: FavoritesService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.twitterDone = false;
    this.tab = this.resultsService.openedTab;
    if (this.favList) {
      this.openedEvent = this.favoritesService.openedEvent;
      this.state = this.favoritesService.state;
    } else {
      this.openedEvent = this.resultsService.openedEvent;
      this.state = this.resultsService.state;
    }
    this.isFav = this.favoritesService.isFav(this.openedEvent.event.id);
    this.detailDone = false;
    this.artistItem = 0;
    this.twitterUrl =
      "https://twitter.com/intent/tweet?text=Check out " +
      this.openedEvent.event.name +
      " located at " +
      this.openedEvent.event._embedded.venues[0].name +
      ". Website: " +
      this.openedEvent.event.url +
      "&hashtags=CSCI571EventSearch";

    // Send all HTTP call
    if (
      !this.openedEvent.detail ||
      this.openedEvent.detail.id !== this.openedEvent.event.id
    ) {
      // Details HTTP call
      this.httpService
        .getFromServer("/api/detail?id=" + this.openedEvent.event.id)
        .subscribe(data => {
          this.openedEvent.detail = data.json();
          this.detailDone = true;
        });

      // Artist/Team HTTP call
      var artistsObject = [];
      this.openedEvent.artist = artistsObject;
      if (
        this.openedEvent.event._embedded &&
        this.openedEvent.event._embedded.attractions
      ) {
        for (
          var i = 0;
          i < this.openedEvent.event._embedded.attractions.length;
          i++
        ) {
          var artistObject = {};
          artistObject["name"] = this.openedEvent.event._embedded.attractions[
            i
          ].name;
          artistsObject.push(artistObject);

          // Only search on Sptify when the segment is "Music"
          if (
            this.openedEvent.event.classifications &&
            this.openedEvent.event.classifications[0].segment.name === "Music"
          ) {
            --this.artistItem;
            // Spotify API
            this.httpService
              .getFromServer(
                "/api/music?keyword=" + artistObject["name"] + "&index=" + i
              )
              .subscribe(data => {
                var dataJSON = data.json();
                artistsObject[dataJSON.index]["spotify"] = dataJSON;
                if (
                  ++this.artistItem ===
                  this.openedEvent.event._embedded.attractions.length
                ) {
                  this.artistDone = true;
                }
              });
          }

          // Google Custom Search
          this.httpService
            .getFromServer("/api/image?keyword=" + artistObject["name"])
            .subscribe(data => {
              var dataJSON = data.json();
              if (dataJSON.links.length > 0) {
                // Update the coresponding artist
                for (var j = 0; j < artistsObject.length; j++) {
                  if (
                    artistsObject[j].name.toLowerCase() ===
                    dataJSON.name.toLowerCase()
                  ) {
                    artistsObject[j]["images"] = dataJSON.links;
                  }
                }
              }
              if (
                ++this.artistItem ===
                this.openedEvent.event._embedded.attractions.length
              ) {
                this.artistDone = true;
              }
            });
        }
      } else {
        this.artistDone = true;
      }

      // Songkick API
      this.httpService
        .getFromServer(
          "/api/upcoming?keyword=" +
            this.openedEvent.event._embedded.venues[0].name
        )
        .subscribe(data => {
          this.openedEvent.upcoming = data.json();
          this.upcomingDone = true;
        });

      // Ticketmaster Venue API call (set time out to avoid limit)
      this.httpService
        .getFromServer(
          "/api/venue?keyword=" +
            this.openedEvent.event._embedded.venues[0].name
        )
        .subscribe(data => {
          this.openedEvent.venue = data.json();
          this.venueDone = true;
        });
    } else {
      this.detailDone = true;
      this.artistDone = true;
      this.venueDone = true;
      this.upcomingDone = true;
    }
  }

  onSelect(tab: string) {
    this.tab.tab = tab;
  }

  onSwitchToList() {
    this.switchToList.emit();
  }

  onAddFav() {
    this.favoritesService.addFav(this.openedEvent.detail);
    this.isFav = true;
  }

  onRemoveFav() {
    this.favoritesService.removeFav(this.openedEvent.detail.id);
    this.isFav = false;
  }

  onTwitterDone() {
    this.twitterDone = true;
    console.log("Twitter done!");
  }
}
