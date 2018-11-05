import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit {
  @Output()
  pageSeleted = new EventEmitter<string>();
  pageLoaded = "results";

  constructor() {}

  ngOnInit() {}

  onSelect(page: string, event) {
    this.pageLoaded = page;
    this.pageSeleted.emit(page);
  }
}
