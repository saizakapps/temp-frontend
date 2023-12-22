import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'; // add this 1 of 4

@Pipe({
  name: 'dateUtcToLocal'
})
export class DateFromUTCPipe implements PipeTransform {

  transform(value: any, format: any, isConvert?: any): any {
    if (value) {
      const time = value;
      // let m = moment.utc(time);
      let m = moment(time);
      if (isConvert) {
        m = m.local();
      }
      if (format) {
        return m.format(format);
      }
      return m;
    }
    return '-';

  }

}
