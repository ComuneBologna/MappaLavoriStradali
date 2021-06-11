import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { CompaniesService } from 'app/services/companies.service';
import { CommonValidators } from 'app/common/validators/common.validator';
import { NewCompany, Company } from 'app/models/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
    selector: 'company',
    templateUrl: './company.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanyComponent {
    public form: FormGroup;
    constructor(private _companiesService: CompaniesService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<CompanyComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.form = this._formBuilder.group({
            id: [null],
            name: [null, CommonValidators.required]
        });
    }

    public save(): void {
        if (this.form.valid) {
            let data = this.form.getRawValue();
            let company = new NewCompany();
            company.name = data.name;
            company.isOperationalUnit = false;
            this._companiesService.add(company).subscribe(s => {
                let newCompany = new Company();
                newCompany.id = s;
                newCompany.isOperationalUnit = false;
                newCompany.name = company.name;
                this.dialogRef.close(newCompany);
            });
        }
    }

    public close(): void {
        this.dialogRef.close();
    }

}
