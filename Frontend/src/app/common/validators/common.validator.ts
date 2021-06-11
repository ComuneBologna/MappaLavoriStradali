import { AbstractControl } from '@angular/forms';
import { ValidatorUtils, CustomValidationErrors } from './validator-utils';

export class CommonValidators {
    public static required(control: AbstractControl): CustomValidationErrors | null {
        if (control.value == null || control.value.toString().trim() == '') {
            return ValidatorUtils.required();
        }
        return null;
    };

    public static requiredIf(condition): CustomValidationErrorFunc | null {
        let func = (control: AbstractControl): CustomValidationErrors | null => {
            if (!condition()) {
                return null;
            }
            return CommonValidators.required(control);
        }
        return func;
    }
}

export declare type CustomValidationErrorFunc = {
    (control: AbstractControl): CustomValidationErrors | null;
}
