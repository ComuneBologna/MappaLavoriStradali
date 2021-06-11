import { Pipe, PipeTransform } from '@angular/core';
import { DatetimeUtils } from '../utils/date.utils';
@Pipe({ name: 'onlyDate' })
export class OnlyDatePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return DatetimeUtils.toDate(value);
        }
        return null;
    }
}