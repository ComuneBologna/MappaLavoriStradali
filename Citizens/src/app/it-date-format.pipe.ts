import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
	name: 'dateFormat_IT'
})
export class ItDateFormatPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (value) {
            return moment.utc(value).local().format("DD/MM/YYYY");
		}
		return "N/D";
	}

}
