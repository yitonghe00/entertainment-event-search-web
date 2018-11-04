import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor(private http: Http) {}

  getLocation() {
    return this.http.get("http://ip-api.com/json").pipe(
      map(data => {
        return data;
      })
    );
  }
}
