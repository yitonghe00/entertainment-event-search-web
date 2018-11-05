import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "[app-list-item]",
  templateUrl: "./list-item.component.html",
  styleUrls: ["./list-item.component.css"]
})
export class ListItemComponent implements OnInit {
  @Input()
  result;
  @Input()
  index = 0;
  date: string;
  shortName: string;
  fullName: string;
  catagory: string;
  venue: string;
  matTooltip;

  constructor() {}

  ngOnInit() {
    if (this.result.dates.start.localDate) {
      this.date = this.result.dates.start.localDate;
    } else {
      this.date = "N/A";
    }

    if (this.result.name.length > 40) {
      this.shortName =
        this.result.name.substring(0, this.result.name.lastIndexOf(" ", 40)) +
        " ...";
    } else {
      this.shortName = this.result.name;
    }

    this.fullName = this.result.name;

    if (this.result.classifications && this.result.classifications[0]) {
      if (this.result.classifications[0].genre) {
        this.catagory =
          this.result.classifications[0].genre.name +
          " - " +
          this.result.classifications[0].segment.name;
      } else {
        this.catagory = this.result.classifications[0].segment.name;
      }
    } else {
      this.catagory = "N/A";
    }

    if (this.result._embedded.venues[0].name) {
      this.venue = this.result._embedded.venues[0].name;
    } else {
      this.venue = "N/A";
    }
  }
}
