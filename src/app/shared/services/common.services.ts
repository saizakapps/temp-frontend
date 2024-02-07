import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import _ from 'underscore';
import * as __ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  /* Common Subject */
  public commonSubject = new Subject<any>();
  public commonSubjectResEmit$ = this.commonSubject.asObservable();

  constructor() { }

  /* emit Common Subject */
  emitCommonSubject(obj?) {
    this.commonSubject.next(obj);
  }

  sortRegion(countryList: any) {
    let tempArray = [];
    countryList.forEach(element => {

      let numericString = [];
      let nonNumericString = [];

      let sortedNumericString = [];
      let sortedNonNumericString = [];

      element.child.forEach(region => {
        if (region.desc.match(/\d+/)) {
          region.sequenceId = parseInt(region.desc.match(/\d+/)[0]);
          numericString.push(region);
        } else {
          nonNumericString.push(region);
        }
      });

      sortedNumericString = [..._.sortBy(numericString, 'sequenceId')];
      sortedNonNumericString = [...nonNumericString.sort()];

      element.child = sortedNumericString.concat(sortedNonNumericString);
    });
    tempArray = [...countryList];
    return tempArray;
  }

  compareStringsCharByChar(str1, str2) {
    if (str1.length === 0) {
      return false;
    }
    for (let i = 0; i < str1.length; i++) {
      if (str1[i] !== str2[i]) {
        return false;
      }
    }
    return true;
  }

  private dataSubject = new Subject<any>();

// Observable to subscribe to changes
data$ = this.dataSubject.asObservable();

// Method to update data
updateData(data: any) {
  this.dataSubject.next(data);
}

}
