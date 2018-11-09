import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { ResultsService } from "./results.service";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  url = environment.apiUrl;

  constructor(private http: Http, private resultsService: ResultsService) {}

  getFromServer(path: string) {
    return this.http.get(this.url + path).pipe(
      map(
        data => {
          return data;
        },
        error => {
          this.resultsService.state.state = "error";
        }
      )
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
