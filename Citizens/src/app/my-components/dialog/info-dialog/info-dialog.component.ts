import { Component, OnInit, Inject, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';


class CrossFieldErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control.dirty && form.invalid;
    }
  }

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

    name: string;
    userForm: FormGroup;
    errorMatcher = new CrossFieldErrorMatcher();
    
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
     }
  
  
    ngOnInit() {
      this.name = "";
  
  
    }
  
  
  

}
