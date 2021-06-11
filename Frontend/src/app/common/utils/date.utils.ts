import * as moment from 'moment/moment';

export class DatetimeUtils {

    public static toDate = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('L');
        }
        return value;
    }

    public static toDateTime = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('L LTS');
        }
        return value;
    }

    public static toTime = (value: string): string => {
        if (value) {
            return moment.utc(value).local().format('LTS');
        }
        return value;
    }

    public static now = (): Date => {
        return moment.utc().toDate();
    }
}