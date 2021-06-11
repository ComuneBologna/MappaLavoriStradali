import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonValidators } from 'app/common/validators/common.validator';
import { Observable, forkJoin } from 'rxjs';
import { Company, PermissionCodes, Settings } from 'app/models/models';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpService } from 'app/services/http.service';
import { CompaniesService } from 'app/services/companies.service';
import { settings } from 'cluster';

@Component({
    selector: 'importWork',
    templateUrl: 'importWork.component.html'
})

export class ImportWorkComponent implements OnInit {

    public form: FormGroup;
    public companies: Company[] = [];
    public file: File = null;
    public fileName: string = null;


    constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ImportWorkComponent>, private httpService: HttpService,
        private _companiesService: CompaniesService, private _matSnackBar: MatSnackBar) {
        let companyId = null;
        let company = this.companies.find(f => f.id == companyId);

        this.form = this._formBuilder.group({
            companyId: [null, CommonValidators.required],
            companyName: [{ name: company ? company.name : null }, CommonValidators.required],
            import: ['', CommonValidators.required],
        })
    }


    ngOnInit() {
        let obs = Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin) ? this._companiesService.getCompanies() : this._companiesService.getMyCompany().pipe(map(result => [result]));
        obs.subscribe(result => {
            this.companies = result;
            this.setAutocompletes();
        })

    }

    public filteredCompanies: Observable<Company[]>;

    private setAutocompletes = (): void => {
        this.filteredCompanies = this.form.controls['companyName'].valueChanges.pipe(
            map(value => {
                let valueToSearch = (value && value.name) ? value.name : value;
                let lowValue = (valueToSearch || "").toLowerCase();
                return this.companies.filter(f => f.name.toLowerCase().indexOf(lowValue) >= 0);
            })
        );
    }

    public displayCompany = (company: Company): string => {
        return company ? company.name : null;
    }

    public companySelected = (event: MatAutocompleteSelectedEvent): void => {
        if (event && event.option && event.option.value) {
            this.form.controls.companyId.setValue(event.option.value.id);
        }
        else {
            this.form.controls.companyId.setValue(null);
        }

    }

    public close(): void {
        this.dialogRef.close();
    }


    public addFile(files: FileList) {
        if (files && files.length) {
            this.file = files[0];
            this.form.get('import').setValue(this.file);
            this.fileName = this.file.name


        }
        else {
            this.fileName = null;
        }
    }

    public save(): void {
        if (this.form.valid) {
            this.httpService.uploadFile<any>('/RoadWorks/upload/' + this.form.controls.companyId.value, this.file)
                .subscribe(
                    (res) => console.log(res),
                    (err) => console.log(err)
                );
        }
        this._matSnackBar.open('La migrazione è stata avviata ed a breve (max 30 min) saranno disponibili eventuali log di errori alla pagina: Log importazione lavori', 'Chiudi', {
            verticalPosition: 'top',
            duration: 6000
        });
        this.dialogRef.close();
    }

}