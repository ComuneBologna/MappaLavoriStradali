import { RoadWorkService } from '../../services/road-works.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { RoadWorksPage } from './road-works.page';
import { RoadWorkCategories } from 'app/models/models';
import { ActivatedRoute } from '@angular/router';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'road-works',
    templateUrl: './road-works.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PlannedRoadWorksPage extends RoadWorksPage {
    constructor(_roadWorkService: RoadWorkService, _dialog: MatDialog, _activatedRoute: ActivatedRoute, _eventBusService: EventBusService) {
        super(_roadWorkService, _dialog, RoadWorkCategories.Planned, _activatedRoute, _eventBusService)
    }
}
