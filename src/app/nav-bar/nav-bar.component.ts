import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit {
  @Output()
  pageSeleted = new EventEmitter<string>();
  @Input()
  loadedPage;

  constructor() {}

  ngOnInit() {}

  onSelect(page: string) {
    this.pageSeleted.emit(page);
  }
}
