import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { RoadWorkService } from '../../services/road-works.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/services/companies.service';
import { RoadWaysService } from 'app/services/roadways.service';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';
import { RoadWorkPage } from './road-work.page';
import { Observable, forkJoin, of } from 'rxjs';
import { RoadWorkAttachmentInfo, NewCompany, Company, RoadWorkCategories } from 'app/models/models';
import { MatDialog } from '@angular/material';
import { CompanyComponent } from './company.component';
import { EventBusService } from 'app/services/event-bus.service';

export abstract class BaseRoadWorkAdminPage extends RoadWorkPage {
    
    constructor(scheduled: RoadWorkCategories, _roadWorkService: RoadWorkService, _roadWaysService: RoadWaysService, _neighborhoodsService: NeighborhoodsService, _companiesService: CompaniesService, _formBuilder: FormBuilder, _activatedRoute: ActivatedRoute, _router: Router, _matSnackBar: MatSnackBar, _dialog: MatDialog, _eventBusService: EventBusService) {
        super(_roadWorkService, _roadWaysService, _neighborhoodsService, _companiesService,_dialog, _formBuilder, _activatedRoute, _router, _matSnackBar, _eventBusService)
        this.scheduled = scheduled;
    }

    protected getAttachments = (roadworkId?:number): Observable<RoadWorkAttachmentInfo[]> => {
        if(roadworkId){
            return this._roadWorkService.getAttachments(roadworkId);
        }
        else {
            return of([]);    
        }
    }

    public addCompany = (id: number): void => {
        this._dialog.open(CompanyComponent, {
            width: '650px',
            data: { title: 'Nuova ditta' }
        }).afterClosed().subscribe((result:Company) => {
            if (result){
                this.addNewCompany(result);
            }
        });
    }

}