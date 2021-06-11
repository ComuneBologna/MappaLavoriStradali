import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUtils } from '../utils/date.utils';

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {

    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toTime(value);
        }
        return null;
    }
}