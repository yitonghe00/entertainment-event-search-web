import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

import { HttpService } from "../shared/http.service";
import { ResultsService } from "../shared/results.service";

@Component({
  selector: "search-form",
  templateUrl: "./search-form.component.html",
  providers: [HttpService]
})
export class SearchFormComponent implements OnInit {
  keyword: FormControl;
  catagory: FormControl;
  distance: FormControl;
  unit: FormControl;
  from: FormControl;
  location: FormControl;
  searchForm: FormGroup;
  searchResult = [];
  lat: number;
  lng: number;
  gotLocation: boolean = false;
  @Output()
  resetList = new EventEmitter<any>();

  constructor(
    private httpService: HttpService,
    private resultsService: ResultsService
  ) {}

  initForm() {
    this.keyword = new FormControl("", [
      Validators.required,
      this.noWhitespaceValidator
    ]);
    this.catagory = new FormControl("all");
    this.distance = new FormControl(null);
    this.unit = new FormControl("miles");
    this.from = new FormControl("current");
    this.location = new FormControl("", [
      Validators.required,
      this.noWhitespaceValidator
    ]);
    this.searchForm = new FormGroup({
      keyword: this.keyword,
      catagory: this.catagory,
      distance: this.distance,
      unit: this.unit,
      from: this.from,
      location: this.location
    });

    this.searchResult = [];

    this.keyword.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      if (val != "") {
        var path = "/api/autocomplete?keyword=" + val;
        this.httpService.getFromServer(path).subscribe(data => {
          const dataJSON = data.json();
          if (
            dataJSON &&
            dataJSON["_embedded"] &&
            dataJSON["_embedded"]["attractions"]
          ) {
            this.searchResult = dataJSON["_embedded"]["attractions"];
          }
        });
      }
    });
  }

  ngOnInit() {
    this.initForm();

    this.httpService.apiCall("http://ip-api.com/json").subscribe(data => {
      const dataJSON = data.json();
      this.lat = dataJSON.lat;
      this.lng = dataJSON.lon;
      this.gotLocation = true;
    });
  }

  onSubmit() {
    this.resetList.emit();
    this.resultsService.clearResults();
    this.resultsService.state.state = "loading";
    var distanceValue = 10;
    if (this.distance.value) {
      distanceValue = this.distance.value;
    }

    var path =
      "/api/search?keyword=" +
      this.keyword.value +
      "&catagory=" +
      this.catagory.value +
      "&distance=" +
      distanceValue +
      "&unit=" +
      this.unit.value;
    if (this.from.value === "current") {
      path += "&lat=" + this.lat + "&lng=" + this.lng;
    } else {
      path += "&location=" + this.location.value;
    }
    this.httpService.getFromServer(path).subscribe(data => {
      this.resultsService.setResults(data.json());
    });
  }

  onClear() {
    this.ngOnInit();
    this.resetList.emit();
    this.resultsService.clearResults();
    this.resultsService.display.display = "list";
  }

  onClearLocation() {
    this.location = new FormControl("", [
      Validators.required,
      this.noWhitespaceValidator
    ]);
    this.searchForm = new FormGroup({
      keyword: this.keyword,
      catagory: this.catagory,
      distance: this.distance,
      unit: this.unit,
      from: this.from,
      location: this.location
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}
