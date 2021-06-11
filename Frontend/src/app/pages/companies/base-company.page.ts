import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Roadway, Company, NewCompanyUser, NewCompany, Settings, PermissionCodes, NewCompanyUserInfo } from 'app/models/models';
import { forkJoin, of } from 'rxjs';
import { CommonValidators } from 'app/common/validators/common.validator';
import { CompaniesService } from 'app/services/companies.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventBusService } from 'app/services/event-bus.service';

export abstract class BaseCompanyPage implements OnInit {
    public form: FormGroup;
    public isNew: boolean = false;
    public newTitle: string = null;
    public editTitle: string = null;
    public returnUrl: string = null;

    constructor(protected _companiesService: CompaniesService, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private _matSnackBar: MatSnackBar, private isOperationalUnit: boolean, private _eventBusService: EventBusService) {
        if (this.isOperationalUnit) {
            this.newTitle = "Nuova unità operativa";
            this.editTitle = "Modifica unità operativa";
            this.returnUrl = "/operational-units";
        }
        else {
            this.newTitle = "Nuova ditta";
            this.editTitle = "Modifica ditta";
            this.returnUrl = "/companies";
        }
    }

    /**
     * On init
     */
    public ngOnInit(): void {
        let id = this._activatedRoute.snapshot.queryParams["id"];
        this.isNew = id == null;
        if (id) {
            this._companiesService.getCompanyById(id).subscribe(result  => 
                this.createForm(result));
        }
        else {
            this.form = this.createForm( new Company());
        }

    }
    private createForm = (item: Company = null): FormGroup => {

        return this.form = this._formBuilder.group({
            id: [item.id],
            name: [item.name, CommonValidators.required],
        });

    }

    public save(): void {
        if (this.form.valid) {
            this._eventBusService.showSpinner.emit(true);
            let data = this.form.getRawValue();
            let company = new NewCompany();
            company.id = data.id;
            company.name = data.name;
            company.isOperationalUnit = this.isOperationalUnit;
            this._companiesService.save(company).subscribe(s => {
                this.succesfullySaved();
                this._eventBusService.showSpinner.emit(false);
            });
        }
    }

    private succesfullySaved = (): void => {
        this._matSnackBar.open(this.isOperationalUnit ? 'Unità operativa salvata' : 'Ditta salvata', 'Chiudi', {
            verticalPosition: 'top',
            duration: 2000
        });
        if (this.isOperationalUnit) {
            this._router.navigateByUrl("/operational-units");
        }
        else {
            this._router.navigateByUrl("/companies");
        }
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}
