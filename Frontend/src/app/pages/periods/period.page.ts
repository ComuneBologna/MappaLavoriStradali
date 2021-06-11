import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Period, PermissionCodes, Settings } from 'app/models/models';
import { of } from 'rxjs';
import { CommonValidators } from 'app/common/validators/common.validator';
import { ConfigurationService } from 'app/services/configuration.service';
import { EventBusService } from 'app/services/event-bus.service';


@Component({
    selector: 'period',
    templateUrl: './period.page.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PeriodPage implements OnInit {
    public form: FormGroup;
    public isNew: boolean = false;

    constructor(private _configurationService: ConfigurationService, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private _matSnackBar: MatSnackBar , private _eventBusService: EventBusService) {
    }

    /**
     * On init
     */
    public ngOnInit(): void {
        let obs = of(new Period());
        let id = this._activatedRoute.snapshot.queryParams["id"];
        if (id) {
            obs = this._configurationService.getPeriodById(id);
        };
        obs.subscribe(result =>
            this.form = this.createForm(result)
        );
        this.isNew = id == null;
    }
    private createForm = (item: Period = null): FormGroup => {
        return this._formBuilder.group({
            id: [item.id],
            year: [item.year || null, CommonValidators.required],
            submissionStartDate: [item.submissionStartDate, CommonValidators.required],
            submissionEndDate: [item.submissionEndDate, CommonValidators.required],
        });
    }

    public save(): void {
        if (this.form.valid) {
            let data = <Period>this.form.getRawValue();
            this._eventBusService.showSpinner.emit(true);
            //Ompostare la sxection dai punti
            this._configurationService.save(data).subscribe(s => {
                this._matSnackBar.open('Periodo salvato', 'Chiudi', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                this._router.navigateByUrl("/periods");
                this._eventBusService.showSpinner.emit(false);

            })
        }

    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

}
