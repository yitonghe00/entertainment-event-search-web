import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { debounceTime } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable()
export class AutocompleteService {
  url = environment.apiUrl;

  constructor(private http: Http) {}

  searchKeyword(term) {
    return this.http.get(this.url + "/api/autocomplete?keyword=" + term).pipe(
      debounceTime(1000),
      map(data => {
        return data;
      })
    );
  }
}
