import { Component, ViewEncapsulation } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CompaniesService } from 'app/services/companies.service';
import { fuseAnimations } from '@fuse/animations';
import { BaseCompaniesPage } from './base-companies.page';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'companies',
    templateUrl: './base-companies.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class OperationalUnitsPage extends BaseCompaniesPage {
    public title : string = "Unità operative";
    public icon : string = "settings_input_component";
    public addUrl : string = "/operational-unit";
    constructor(_companiesService: CompaniesService, _dialog: MatDialog ,  _eventBusService: EventBusService) {
        super(_companiesService,_dialog, true,"Cancellazione unità operativa",_eventBusService)
    }

    protected delete = (id: number): void => {
        this._companiesService.delete(id).subscribe(result => {
            this.loadData();
        });
    }
}

