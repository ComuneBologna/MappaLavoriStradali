import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { CommonValidators } from 'app/common/validators/common.validator';
import { BackofficeUser, BackofficeUserWrite, Permission, PermissionCodes, SelectListitem, Settings } from 'app/models/models';
import { CompaniesService } from 'app/services/companies.service';
import { EventBusService } from 'app/services/event-bus.service';
import { UsersService } from 'app/services/users.service';
import { RoadWorkUtils } from '../roadworks/roadwork.utils';




@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class UserComponent implements OnInit {

    public form: FormGroup = null;
    public isNew: boolean = false;
    public roles: SelectListitem[] = [];
    public companies: SelectListitem[] = [];
    public canManage: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: BackofficeUser, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<UserComponent>,
        private _router: Router, private _snackBarService: MatSnackBar, private usersService: UsersService, private _companiesService: CompaniesService , private _eventBusService: EventBusService) { }

    ngOnInit(): void {
        this.canManage = Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);

        this.isNew = this.data.id == null;
        if (this.data.id) {
            this.usersService.getUser(this.data.id).subscribe(result => {
                this.createForm(result);
            });
        }
        else {
            this.isNew = true;
            this.createForm();
        }
        this._companiesService.getCompanies().subscribe(result => {
            this.companies = result.map(m => new SelectListitem(m.id, m.name));
        })
        this.roles = [...RoadWorkUtils.getPermissionCodesSelectlistItems()];
    }

    private createForm = (item: BackofficeUser = null): void => {
        item = item || new BackofficeUser();
        this.form = this._formBuilder.group({
            firstName: [item.firstName, CommonValidators.required],
            lastName: [item.lastName, CommonValidators.required],
            fiscalCode: [item.fiscalCode, CommonValidators.required],
            email: [{ value: item.email, disabled: this.data.id }, CommonValidators.required],
            roleCode: [item.roleCode, CommonValidators.required],
            companyId: [item.companyId]
        });
        this.form.controls.companyId.setValidators([CommonValidators.requiredIf(() => this.form.controls.roleCode.value == PermissionCodes.RoadWorks_Operator)])
        this.form.controls.roleCode.valueChanges.subscribe((newValue: PermissionCodes) => {
            if (newValue == PermissionCodes.RoadWorks_Operator) {
                this.form.controls.companyId.enable();
            }
            else {
                this.form.controls.companyId.disable();
            }
        });
        this.form.controls.roleCode.updateValueAndValidity();
    }

    public save(): void {
        if (this.form.valid) {
            let dataToSave = <BackofficeUserWrite>this.form.getRawValue();
            this._eventBusService.showSpinner.emit(true);

            this.usersService.save(dataToSave, this.data.id).subscribe(result => {
                this._eventBusService.showSpinner.emit(false);
                this._snackBarService.open('Utente Salvato', 'Chiudi', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                this.dialogRef.close(true);
               

            })
        }

    }

}