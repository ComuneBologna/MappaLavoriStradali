import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUtils } from '../utils/date.utils';

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {

    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toDateTime(value);
        }
        return null;
    }
}