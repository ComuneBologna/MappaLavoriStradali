import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'form-errors',
    templateUrl: './form-errors.component.html',
})
export class FormErrorsComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public errors:string[]) {

    }
}
