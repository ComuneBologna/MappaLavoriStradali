import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { fuseAnimations } from '@fuse/animations';
import { RoadWorkService } from '../../services/road-works.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/services/companies.service';
import { RoadWaysService } from 'app/services/roadways.service';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';
import { RoadWorkPage } from './road-work.page';
import { MatDialog } from '@angular/material';
import { RoadWorkCategories } from 'app/models/models';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'road-work-user',
    templateUrl: './road-work-user.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RoadWorkUserPage extends RoadWorkPage {
    constructor(_roadWorkService: RoadWorkService, _roadWaysService: RoadWaysService, _neighborhoodsService: NeighborhoodsService, _companiesService: CompaniesService, _formBuilder: FormBuilder, _activatedRoute: ActivatedRoute, _router: Router, _matSnackBar: MatSnackBar, _dialog: MatDialog, _eventBusService: EventBusService) {
        super(_roadWorkService, _roadWaysService, _neighborhoodsService, _companiesService,_dialog, _formBuilder, _activatedRoute, _router, _matSnackBar, _eventBusService)
        this.scheduled = RoadWorkCategories.Scheduled;
    }
}
