import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorUtils, CustomValidationErrors } from './validator-utils';
import * as moment from 'moment/moment';

export class DateValidators {
    public static isDate (c: AbstractControl): CustomValidationErrors | null {
        if (c.value){
            //Parse let hours
            let momentValue = moment.utc(c.value);
            if(!momentValue.isValid()){
                return ValidatorUtils.date();
            }
        }
        return null;
    };

    private static checkTimeParts = (value:string,startSeparator:string,endSeparators:string[],maxValue:number):boolean=>{
        if(value.startsWith(startSeparator) && endSeparators.indexOf(value.substr(3,1))>=0){
            let intValue = parseInt(value.substr(1,2));
            if(!isNaN(intValue) && intValue>=0 && intValue<=maxValue){
                return true;
            }
        }
        return false;
    }
}
