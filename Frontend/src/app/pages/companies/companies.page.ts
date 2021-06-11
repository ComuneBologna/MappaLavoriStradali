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
export class CompaniesPage extends BaseCompaniesPage {
    public title : string = "Ditte";
    public icon : string = "grain";
    public addUrl : string = "/company";
    constructor(_companiesService: CompaniesService, _dialog: MatDialog,  _eventBusService: EventBusService) {
        super(_companiesService,_dialog, false,"Cancellazione ditta",_eventBusService)
    }

    protected delete = (id: number): void => {
        this._companiesService.delete(id).subscribe(result => {
            this.loadData();
        });
    }
}

