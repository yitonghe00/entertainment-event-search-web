import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class SearchService {
  url = environment.apiUrl;

  constructor(private http: Http) {}

  search(
    keyword: string,
    catagory: string,
    distance: number,
    unit: string,
    lat: number,
    lng: number
  ) {
    if (!distance) {
      distance = 10;
    }
    const url =
      this.url +
      "/api/search?keyword=" +
      keyword +
      "&catagory=" +
      catagory +
      "&distance=" +
      distance +
      "&unit=" +
      unit +
      "&lat=" +
      lat +
      "&lng=" +
      lng;

    return this.http.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
}
