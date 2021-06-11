import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material'

import { FormBuilder, FormGroup, FormControl, NgForm, FormGroupDirective, Validators } from '@angular/forms';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}
@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {

  name: string;
  userForm: FormGroup;
  layersName: string[] = [];
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.initForm()
  }


  ngOnInit() {
    this.name = "";


  }



  initForm() {
    this.userForm = this.fb.group({
      insertName: ['', [c => this.checkIfLayerAlreadyExist(c), Validators.required]],

    });
  }

  checkIfLayerAlreadyExist(c: FormControl) {

    let cond: boolean = false;
    this.data.arrayLabels.forEach(element => {
      if (c.value === element) {
        cond = true;
      }
    });
    const condition = cond;
    return condition ? { layerNameAlreadyExist: true } : null;
  }
}
