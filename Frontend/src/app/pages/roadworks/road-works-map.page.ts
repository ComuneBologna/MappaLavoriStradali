import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { RoadWorkService } from '../../services/road-works.service';
import { RoadWorkFilters, RoadWorkCategories, RoadWorkMapItem } from 'app/models/models';

import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GeoFeatureContainer } from 'app/models/GeoFeature';
import { RoadWorksMapDetailComponent } from './road-works-map-detail.component';

@Component({
    selector: 'road-works',
    templateUrl: './road-works-map.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoadWorksMapPage implements OnInit {
    public enumUtils: EnumUtils = EnumUtils;
    public filters = new RoadWorkFilters();
    public features: GeoFeatureContainer[] = [];
    public roadworks: RoadWorkMapItem[] = [];
    public scheduled: boolean = false;
    public totalCount : number = 0;
    constructor(private _roadWorkService: RoadWorkService, private _activatedRoute: ActivatedRoute,private _dialog: MatDialog) {

    }

    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe(params => {
            this.scheduled = params.get("scheduled") == "scheduled";
            this.filters = new RoadWorkFilters();
            this.roadworks = [];
            this.totalCount = 0;
            this.features = [];
        })
    }

    public search = (searchData: RoadWorkFilters): void => {
        // searchData.categories = this.scheduled ? RoadWorkCategories.Scheduled : RoadWorkCategories.NotScheduled;
        if (this.scheduled){
            searchData.categories.push(RoadWorkCategories.Scheduled);
        }
        else if (!this.scheduled) {
            searchData.categories.push(RoadWorkCategories.NotScheduled);
            
        }
        this._roadWorkService.getMapData(searchData).subscribe(s => {
            this.roadworks = [...s.items];
            this.totalCount = s.totalCount;
            this.features = [...s.items.map(m => m.geoFeatureContainer)];
        });
    }

    public selectedWork = (roadWorkId: any): void => {
        let roadWorkItem = this.roadworks.find(f=> f.id == +roadWorkId);
        const dialogRef = this._dialog.open(RoadWorksMapDetailComponent,{
            data: roadWorkItem,
            width: '60%',
        });
    }
}

