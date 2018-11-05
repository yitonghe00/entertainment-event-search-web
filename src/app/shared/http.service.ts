import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  url = environment.apiUrl;

  constructor(private http: Http) {}

  getFromServer(path: string) {
    return this.http.get(this.url + path).pipe(
      map(data => {
        return data;
      })
    );
  }

  apiCall(url: string) {
    return this.http.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }
}
