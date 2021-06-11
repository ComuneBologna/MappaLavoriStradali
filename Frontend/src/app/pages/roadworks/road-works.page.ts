import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { RoadWorkService } from '../../services/road-works.service';
import { RoadWorkItem, SelectListitem, RoadWorkFilters, Settings, Company, RoadWorkCategories, RoadWorkMapItem, PermissionCodes } from 'app/models/models';
import { DatetimeUtils } from 'app/common/utils/date.utils';

import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { GeoFeatureContainer } from 'app/models/GeoFeature';
import { MatTabChangeEvent, MatSort } from '@angular/material';
import { RoadWorksMapDetailComponent } from './road-works-map-detail.component';
import { ImportWorkComponent } from './importWork.component';
import { ActivatedRoute } from '@angular/router';
import { EventBusService } from 'app/services/event-bus.service';

export abstract class RoadWorksPage implements OnInit {
    public dataSource: MatTableDataSource<RoadWorkItem>;
    private lastFilter: RoadWorkFilters = null;
    public totalCount: number = 0;
    public companies: Company[] = [];
    public pageIndex: number = 0;
    public pageSize: number = 10;
    public enumUtils: EnumUtils = EnumUtils;
    public canImport: boolean = false;
    public canExport: boolean = false;
    public features: GeoFeatureContainer[] = [];
    public showMap: boolean = false;
    public mapRoadworks: RoadWorkMapItem[] = [];
    public visibleWorks: any = {};
    public RoadWorkCategories = RoadWorkCategories;
    public setCriteria: string;

    public displayedColumns = ['isOverlap', 'category', 'address', 'neighborhood', 'companyName', 'description', 'roadways', 'status', 'startDate', 'endDate', 'actions'];

    @ViewChild(MatPaginator, { static: true })
    private paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;


    constructor(private _roadWorkService: RoadWorkService, private _dialog: MatDialog, public scheduled: RoadWorkCategories, private _activatedRoute: ActivatedRoute , private _eventBusService: EventBusService) {
        this.canImport = !this.canManage;
        this.canExport = this.canManage;
        // this.categories = scheduled;
        if (this.canManageOffice) {
            this.displayedColumns = ['isOverlap', 'publishStatus', 'category', 'address', 'neighborhood', 'companyName', 'description', 'roadways', 'status', 'startDate', 'endDate', 'actions']
        }
    }

    ngOnInit(): void {      
        this._eventBusService.showSpinner.emit(true);
        this.dataSource = new MatTableDataSource([]);
        this.paginator.page.pipe(tap(() => this.loadData())).subscribe();
        this.dataSource.sort = this.sort;        
    }

    public search = (searchData: RoadWorkFilters): void => {

        let readcriteria = this._activatedRoute.snapshot.queryParams['criteria'];
        if (readcriteria != null) {
            searchData = JSON.parse(readcriteria);
        }
        this.pageIndex = 0;
        this.lastFilter = searchData;
        this.loadData();
    }

    private loadData = (): void => {
        let criteria = this.lastFilter;
        // criteria.category = this.scheduled ? RoadWorkCategories.Planned : RoadWorkCategories.NotPlanned;
        if (this.canManageOffice) {
                this._roadWorkService.getPressOfficeWorks(criteria, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(s => {
                this.totalCount = s.totalCount;
                this.dataSource.data = [...s.items];


            });
            this._roadWorkService.getMapPressOffice(criteria).subscribe(s => {
                this.mapRoadworks = [...s.items];
                this.features = [...s.items.map(m => m.geoFeatureContainer)];
                this.visibleWorks = {};
                s.items.forEach((v) => {
                    this.visibleWorks[v.geoFeatureContainer.id.toString()] = v;
                })
            });
        }
        else {
            this._roadWorkService.getData(criteria, this.paginator.pageIndex + 1, this.paginator.pageSize).subscribe(s => {
                this.totalCount = s.totalCount;
                this.dataSource.data = [...s.items];
            });
            this._roadWorkService.getMapData(criteria).subscribe(s => {
                this.mapRoadworks = [...s.items];
                this.features = [...s.items.map(m => m.geoFeatureContainer)];
                this.visibleWorks = {};
                s.items.forEach((v) => {
                    this.visibleWorks[v.geoFeatureContainer.id.toString()] = v;
                })
            });
         

        }
        this._eventBusService.showSpinner.emit(false);


    }

    public changeTab = (data: MatTabChangeEvent): void => {
        this.showMap = data.index == 1;

    }

    public startDelete = (id: number): void => {
        this._dialog.open(DeleteDialogComponent, {
            width: '350px',
            data: { title: 'Cancellazione lavoro' }
        }).afterClosed().subscribe(result => {
            if (result)
                this.delete(id);
        });

    }

    private delete = (id: number): void => {
         this._eventBusService.showSpinner.emit(true);
         this._roadWorkService.delete(id).subscribe(result => {
            this.loadData();
            this._eventBusService.showSpinner.emit(false);
            })
         }

    public manageAddLink = (categories: RoadWorkCategories): string => {
        if (this.canManage) {
            return categories == RoadWorkCategories.Planned ? "/roadwork/planned"
                : categories == RoadWorkCategories.Scheduled ? "/roadwork/scheduled"
                    : "/roadwork/noscheduled";
            //return scheduled ? "/roadwork/scheduled" : "/roadwork/noscheduled";
        }
        else {
            return "/roadwork/user";
        }
    }
    

    public manageEditLink = (item: RoadWorkItem): string => {
        if (this.canManage || this.canManageOffice) {
            
            return item.category == RoadWorkCategories.Scheduled ? "/roadwork/scheduled" : item.category == RoadWorkCategories.NotScheduled ?
                "/roadwork/noscheduled" : "/roadwork/planned";
            // return item.category == RoadWorkCategories.Scheduled ? "/roadwork/scheduled" : "/roadwork/noscheduled";
            
        }
        else {
            return "/roadwork/user";
        }
    }

    public get setSerchCriteriaString() {
        this.setCriteria = JSON.stringify(this.lastFilter)
        return this.setCriteria;
    }

    public selectedWork = (roadWorkId: any): void => {
        let roadWorkItem = this.mapRoadworks.find(f => f.id == +roadWorkId);
        const dialogRef = this._dialog.open(RoadWorksMapDetailComponent, {
            data: roadWorkItem,
            width: '60%',
        });
    }

    public importWork = (id: number): void => {
        this._dialog.open(ImportWorkComponent, {
            width: '650px',
            data: { title: 'Nuova ditta' }
        });
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

    public get canManageOffice() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_PressOffice);
    }
}

