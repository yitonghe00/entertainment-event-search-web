import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any[], field: string, ascending: boolean): any[] {
    array = array.slice();
    array.sort((a: any, b: any) => {
      if (a[field].localeCompare(b[field]) < 0) {
        return ascending ? -1 : 1;
      } else if (a[field].localeCompare(b[field]) > 0) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
