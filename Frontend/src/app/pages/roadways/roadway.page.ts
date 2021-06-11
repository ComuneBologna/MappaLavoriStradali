import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionCodes, Roadway, Settings } from 'app/models/models';
import { of } from 'rxjs';
import { CommonValidators } from 'app/common/validators/common.validator';
import { RoadWaysService } from 'app/services/roadways.service';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'roadway',
    templateUrl: './roadway.page.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RoadWayPage implements OnInit {
    public form: FormGroup;
    public isNew: boolean = false;

    constructor(private _roadWaysService: RoadWaysService, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private _matSnackBar: MatSnackBar, private _eventBusService: EventBusService) {
    }

    /**
     * On init
     */
    public ngOnInit(): void {
        let obs = of(new Roadway());
        let id = this._activatedRoute.snapshot.queryParams["id"];
        if (id) {
            obs = this._roadWaysService.getRoadwayById(id);
        };
        obs.subscribe(result =>
            this.form = this.createForm(result)
        );
        this.isNew = id == null;
    }
    private createForm = (item: Roadway = null): FormGroup => {
        return this._formBuilder.group({
            id: [item.id],
            name: [item.name, CommonValidators.required],
        });
    }

    public save(): void {
        if (this.canManage) {
            if (this.form.valid) {
                this._eventBusService.showSpinner.emit(true);
                let data = <Roadway>this.form.getRawValue();
                //Ompostare la sxection dai punti
                this._roadWaysService.save(data).subscribe(s => {
                    this._matSnackBar.open('Sede salvata', 'Chiudi', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                    this._router.navigateByUrl("/roadways");
                    this._eventBusService.showSpinner.emit(false);
                })
            }
        }
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}
