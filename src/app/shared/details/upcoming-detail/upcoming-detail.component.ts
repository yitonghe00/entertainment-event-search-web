import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from "@angular/animations";
import * as moment from "moment";

import { ResultsService } from "../../results.service";
import { ArraySortPipe } from "./array-sort.pipe";
import { FavoritesService } from "../../favorites.service";

@Component({
  selector: "app-upcoming-detail",
  templateUrl: "./upcoming-detail.component.html",
  styleUrls: ["./upcoming-detail.component.css"],
  providers: [ArraySortPipe],
  animations: [
    trigger("listAnimation", [
      transition(":increment", [
        query(
          ":enter",
          [
            style({ height: 0, opacity: 0 }),
            stagger(0, [animate("300ms", style({ height: 100, opacity: 1 }))])
          ],

          {
            optional: true
          }
        )
      ]),
      transition(":decrement", [
        query(
          ":leave",
          [stagger(0, [animate("300ms", style({ height: 0, opacity: 0 }))])],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})
export class UpcomingDetailComponent implements OnInit {
  openedEvent;
  @ViewChild("keyOption")
  keyOption: ElementRef;
  @ViewChild("sortOption")
  sortOption: ElementRef;
  isAsending: boolean;
  lessItem: boolean;
  top5Events;
  afterEvents;
  otherEvents;
  @Input()
  favList;
  selectOption;

  constructor(
    private resultsService: ResultsService,
    private favoritesService: FavoritesService,
    private sortBy: ArraySortPipe
  ) {}

  ngOnInit() {
    if (!this.favList) {
      this.openedEvent = this.resultsService.openedEvent;
    } else {
      this.openedEvent = this.favoritesService.openedEvent;
    }
    this.selectOption = this.resultsService.selectOption;
    this.openedEvent.upcoming.forEach(event => {
      var dateTime = moment(event.date).format("MMM Do, YYYY");
      if (event.time && event.time !== "null" && event.time !== "N/A") {
        dateTime += " " + event.time;
      }
      event["dateTime"] = dateTime; // For display
      event["eventTime"] = event.date + event.time; // For sorting
    });
    this.lessItem = true;
    this.top5Events = this.openedEvent.upcoming.slice(0, 5);
    this.otherEvents = this.openedEvent.upcoming.slice(
      5,
      this.openedEvent.upcoming.length
    );
    this.afterEvents = [];
  }

  onChangeKeyOption() {
    this.selectOption.keyOption = this.keyOption.nativeElement.value;
    if (this.selectOption.keyOption !== "default") {
      var newOrder = this.sortBy.transform(
        this.openedEvent.upcoming,
        this.selectOption.keyOption,
        this.selectOption.sortOption === "ascending"
      );
      this.top5Events = newOrder.slice(0, 5);
      this.otherEvents = newOrder.slice(5, this.openedEvent.upcoming.length);
    } else {
      this.top5Events = this.openedEvent.upcoming.slice(0, 5);
      this.otherEvents = this.openedEvent.upcoming.slice(
        5,
        this.openedEvent.upcoming.length
      );
      this.afterEvents = [];
    }
    if (!this.lessItem) {
      this.afterEvents = this.otherEvents;
    }
  }

  onChangeSortOption() {
    this.selectOption.sortOption = this.sortOption.nativeElement.value;
    var newOrder = this.sortBy.transform(
      this.openedEvent.upcoming,
      this.selectOption.keyOption,
      this.selectOption.sortOption === "ascending"
    );
    this.top5Events = newOrder.slice(0, 5);
    this.otherEvents = newOrder.slice(5, this.openedEvent.upcoming.length);
    if (!this.lessItem) {
      this.afterEvents = this.otherEvents;
    }
  }

  toggle() {
    this.lessItem ? this.showItems() : this.hideItems();
  }

  hideItems() {
    this.lessItem = true;
    this.afterEvents = [];
  }

  showItems() {
    this.lessItem = false;
    this.afterEvents = this.otherEvents;
  }
}
