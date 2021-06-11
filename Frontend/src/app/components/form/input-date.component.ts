import { Component, forwardRef, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';

import { InputComponent } from './input.component';

import * as moment from 'moment/moment';

@Component({
    selector: 'input-date',
    templateUrl: './input-date.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputDateComponent),
        multi: true
    }]
})
export class InputDateComponent extends InputComponent<string, moment.Moment> {
    constructor(controlContainer: ControlContainer) {
        super(controlContainer);
    }


    protected toInternalFormat(value: string): moment.Moment {
        let utc = moment.utc(value).local();
        return utc;
    }
    protected toExternalFormat(value: moment.Moment): string {
        return value.toISOString();
    }
}
