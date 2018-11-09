import { Component, OnInit, Input } from "@angular/core";
import { ResultsService } from "../../results.service";
import * as moment from "moment";
import * as $ from "jquery";
import { FavoritesService } from "../../favorites.service";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.css"]
})
export class EventDetailComponent implements OnInit {
  openedEvent;
  artists = "";
  venue = "";
  time = "";
  catagory = "";
  priceRanges = "";
  ticketStatus = "";
  url = "";
  seatMap = "";
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

    this.generateItems();
    $("#seatMapModal").appendTo("body");
  }

  ngOnDestroy() {
    $("#seatMapModal").remove();
  }

  generateItems() {
    // Artist/Team(s)
    if (
      this.openedEvent.detail._embedded &&
      this.openedEvent.detail._embedded.attractions
    ) {
      this.artists += this.openedEvent.detail._embedded.attractions[0].name;
      for (
        var i = 1;
        i < this.openedEvent.detail._embedded.attractions.length;
        i++
      ) {
        this.artists +=
          " | " + this.openedEvent.detail._embedded.attractions[i].name;
      }
    }

    // Venue
    if (
      this.openedEvent.detail._embedded &&
      this.openedEvent.detail._embedded.venues
    ) {
      this.venue = this.openedEvent.detail._embedded.venues[0].name;
    }

    // Time
    if (this.openedEvent.detail.dates && this.openedEvent.detail.dates.start) {
      this.time += moment(this.openedEvent.detail.dates.start.localDate).format(
        "MMM Do, YYYY"
      );
      if (this.openedEvent.detail.dates.start.localTime) {
        this.time += " " + this.openedEvent.detail.dates.start.localTime;
      }
    }

    // Catagory
    if (this.openedEvent.detail.classifications) {
      this.catagory += this.openedEvent.detail.classifications[0].segment.name;
      if (
        this.openedEvent.detail.classifications[0].genre &&
        this.openedEvent.detail.classifications[0].genre.name !== "Undefined"
      ) {
        this.catagory +=
          " | " + this.openedEvent.detail.classifications[0].genre.name;
      }
    }

    // Price Range
    if (this.openedEvent.detail.priceRanges) {
      if (
        this.openedEvent.detail.priceRanges[0].min &&
        this.openedEvent.detail.priceRanges[0].max
      ) {
        this.priceRanges +=
          "$" +
          this.openedEvent.detail.priceRanges[0].min +
          " ~ $" +
          this.openedEvent.detail.priceRanges[0].max;
      } else {
        if (this.openedEvent.detail.priceRanges[0].min) {
          this.priceRanges += "$" + this.openedEvent.detail.priceRanges[0].min;
        } else {
          this.priceRanges += "$" + this.openedEvent.detail.priceRanges[0].max;
        }
      }
    }

    // Ticket Status
    if (
      this.openedEvent.detail.dates &&
      this.openedEvent.detail.dates.status &&
      this.openedEvent.detail.dates.status.code
    ) {
      this.ticketStatus = this.openedEvent.detail.dates.status.code;
    }

    // URL
    if (this.openedEvent.detail.url) {
      this.url = this.openedEvent.detail.url;
    }

    // SeatMap
    if (this.openedEvent.detail.seatmap) {
      this.seatMap = this.openedEvent.detail.seatmap.staticUrl;
    }
  }
}
