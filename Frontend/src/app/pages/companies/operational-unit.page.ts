import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, NewCompany } from 'app/models/models';
import { CompaniesService } from 'app/services/companies.service';
import { BaseCompanyPage } from './base-company.page';
import { EventBusService } from 'app/services/event-bus.service';


@Component({
    selector: 'operational-unit',
    templateUrl: './base-company.page.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OperationalUnitPage extends BaseCompanyPage {
    constructor(_companiesService: CompaniesService, _formBuilder: FormBuilder, _activatedRoute: ActivatedRoute, _router: Router, _matSnackBar: MatSnackBar , _eventBusService: EventBusService) {
        super(_companiesService, _formBuilder, _activatedRoute, _router, _matSnackBar, true, _eventBusService)
    }
}
