import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorUtils, CustomValidationErrors } from './validator-utils';

export class ArrayValidators {
    public static minItems = (minItems: number): ValidatorFn => {
        return (c: AbstractControl): CustomValidationErrors | null => {
            if ((<any[]>c.value).length < minItems) {
                return ValidatorUtils.minItems(minItems);
            }
            return null;
        };
    }

}
