import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { LocationService } from "./location.service";
import { AutocompleteService } from "./autocomplete.service";
import { SearchService } from "./search.service";

@Component({
  selector: "search-form",
  templateUrl: "./search-form.component.html",
  providers: [AutocompleteService, LocationService]
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

  constructor(
    private autocompleteService: AutocompleteService,
    private locationService: LocationService,
    private searchService: SearchService
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

    this.keyword.valueChanges.subscribe(val => {
      if (val != "") {
        this.autocompleteService.searchKeyword(val).subscribe(data => {
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

    this.locationService.getLocation().subscribe(data => {
      const dataJSON = data.json();
      this.lat = dataJSON.lat;
      this.lng = dataJSON.lon;
      this.gotLocation = true;
    });
  }

  onSubmit() {
    this.searchService
      .search(
        this.keyword.value,
        this.catagory.value,
        this.distance.value,
        this.unit.value,
        this.lat,
        this.lng
      )
      .subscribe(data => {
        console.log(data.json());
      });
  }

  onClear() {
    this.ngOnInit();
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
