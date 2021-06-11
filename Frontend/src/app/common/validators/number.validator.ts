import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorUtils, CustomValidationErrors } from './validator-utils';


export class NumberValidators {
    public static isInteger(c: AbstractControl): CustomValidationErrors | null {
        if (c.value) {
            if (isNaN(c.value)) {
                return ValidatorUtils.integer();
            }
            if (Math.trunc(c.value) != c.value) {
                return ValidatorUtils.integer();
            }
        }
        return null;
    };
    public static isDecimal = (numOfDecimals: number): ValidatorFn => {
        return (c: AbstractControl): CustomValidationErrors | null => {
            if (isNaN(c.value)) {
                return ValidatorUtils.decimal();
            }
            if (c.value) {
                if (Math.trunc(c.value) != c.value) {
                    if (c.value.toString().split('.')[1].length > numOfDecimals) {
                        return ValidatorUtils.decimalInvalidDigits(numOfDecimals);
                    }
                }
            }
            return null;
        };
    }

    public static minValue = (minValue: number): ValidatorFn => {
        return (c: AbstractControl): CustomValidationErrors | null => {
            if (isNaN(c.value)) {
                return ValidatorUtils.decimal();
            }
            if (c.value != null) {
                if (+c.value < minValue) {
                    return ValidatorUtils.minNumericValue(minValue);
                }
            }
            return null;
        };
    }

    public static maxValue = (maxValue: number): ValidatorFn => {
        return (c: AbstractControl): CustomValidationErrors | null => {
            if (isNaN(c.value)) {
                return ValidatorUtils.decimal();
            }
            if (c.value != null) {
                if (+c.value > maxValue) {
                    return ValidatorUtils.maxNumericValue(maxValue);
                }
            }
            return null;
        };
    }
}
