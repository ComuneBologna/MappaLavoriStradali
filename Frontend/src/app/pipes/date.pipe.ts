import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUtils } from '../utils/datetime.utils';

@Pipe({ name: 'date' })
export class DateMomentPipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toDate(value);
        }
        return null;
    }
}