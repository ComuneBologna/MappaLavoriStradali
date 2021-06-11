import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { RoadWorkService } from '../../services/road-works.service';
import { RoadWorkItem, SelectListitem, RoadWorkFilters, Settings, Company, CompanyTypes, PermissionCodes, Neighborhood, Roadway } from 'app/models/models';
import { DatetimeUtils } from 'app/common/utils/date.utils';

import { FormGroup, FormBuilder } from '@angular/forms';
import { NumberValidators } from 'app/common/validators/number.validator';
import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { RoadWorkUtils } from './roadwork.utils';
import { CompaniesService } from 'app/services/companies.service';
import { MatExpansionPanel } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBusService } from 'app/services/event-bus.service';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';
import { RoadWaysService } from 'app/services/roadways.service';

@Component({
    selector: 'road-works-search',
    templateUrl: './road-works-search.component.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoadWorksSearchComponent implements OnInit, OnDestroy {
    public priorityItems: SelectListitem[] = [];
    public overlapItems: SelectListitem[] = [];
    public statusItems: SelectListitem[] = [];
    public companyTypes: SelectListitem[] = [];
    public visibleTypes: SelectListitem[] = [];
    public RoadWorkCategories: SelectListitem[] = [];
    public visibleItems: SelectListitem[] = [];
    public years: any[] = [];
    public formFilter: FormGroup;
    public companies: Company[] = [];
    public enumUtils: EnumUtils = EnumUtils;
    public canImport: boolean = false;
    public subscription: Subscription = null;
    public panelOpenState: boolean = false;
    public lastFilter: string;
    public neighborhoodsItems: Neighborhood[] = [];
    public roadways: Roadway[] = [];

    @ViewChild("searchPanel", { static: false }) public searchExpansionPanel: MatExpansionPanel;

    @Input() public autoSearch: boolean = true;
    @Input()
    public set filters(filters: RoadWorkFilters) {
        filters = filters || new RoadWorkFilters();
        this.formFilter = this._formBuilder.group({
            yearFrom: [filters.yearFrom, [NumberValidators.isInteger]],
            yearTo: [filters.yearTo, [NumberValidators.isInteger]],
            neighborhood: [filters.neighborhood],
            companyId: [filters.companyId],
            roadwayName: [filters.roadwayName],
            description: [filters.description],
            status: [filters.status],
            priorities: [filters.priorities],
            isOverlap: [filters.isOverlap],
            addressName: [filters.addressName],
            effectiveStartDateFrom: [filters.effectiveStartDateFrom],
            effectiveStartDateTo: [filters.effectiveStartDateTo],
            effectiveEndDateFrom: [filters.effectiveEndDateFrom],
            effectiveEndDateTo: [filters.effectiveEndDateTo],
            companyType: [filters.companyType],
            visibleType: [filters.visibleType],
            categories: [filters.categories],
            publishStatus: [filters.publishStatus]
        });

        this.destrorySubscription();
        this.subscription = this.formFilter.controls.companyType.valueChanges.subscribe(newValue => {
            this.formFilter.controls.companyId.setValue(null);
        })
    }
    @Output() public onSearch: EventEmitter<RoadWorkFilters> = new EventEmitter<RoadWorkFilters>();

    constructor(private router: Router, private _roadWorkService: RoadWorkService, private _companiesService: CompaniesService, private _roadwaysService: RoadWaysService, private _neighborhoodsService: NeighborhoodsService, private _formBuilder: FormBuilder, private _dialog: MatDialog, private _activatedRoute: ActivatedRoute  , private _eventBusService: EventBusService) {
        this.canImport = !this.canManage;
        this.priorityItems = RoadWorkUtils.getPrioritySelectlistItems();
        this.overlapItems = [{ id: true, label: "Si" }, { id: false, label: "No" }];
        this.statusItems = RoadWorkUtils.getStatusSelectlistItems(false);
        this.companyTypes = RoadWorkUtils.getCompanySelectlistItems();
        this.visibleTypes = RoadWorkUtils.getVisibleSelectlistItems();
        this.RoadWorkCategories = RoadWorkUtils.getCategorySelectlistItems();
        this.visibleItems = RoadWorkUtils.getPublishStatus();
        this.filters = new RoadWorkFilters();
    }

    ngOnInit(): void {
        this.lastFilter = (this._activatedRoute.snapshot.queryParams['criteria']);
        this.newCriteria();
        let companyObs = this.canManage || this.canManageOffice ? this._companiesService.getCompanies() : this._companiesService.getMyCompany().pipe(map(result => [result]));
        forkJoin(companyObs, this._roadWorkService.getYears(true), this._neighborhoodsService.getNeighborhoods(), this._roadwaysService.getRoadways()).subscribe(results => {
            this.companies = [...results[0]];
            let companyTypes = this.companies.distinct(d => d.isOperationalUnit);
            if (companyTypes.length < 2) {
                this.companyTypes = RoadWorkUtils.getCompanySelectlistItems(companyTypes[0] ? CompanyTypes.OperationalUnit : CompanyTypes.Company);
            }

            for (let i = 0; i < results[1].length; i++) {
                this.years.push({ id: results[1][i].year, label: results[1][i].year });
            }
            if (this.years.length > 0) {
                this.formFilter.controls["yearFrom"].setValue(results[1].find(f => f.isDefault).year);
            }
            if (this.years.length > 0) {
                this.formFilter.controls["yearTo"].setValue(results[1].find(f => f.isDefault).year);
            }
            if(results[2]){
                this.neighborhoodsItems = results[2];
            }
            if(results[3]){
                this.roadways = results[3];
            }
            if (this.autoSearch) {
                this.search();
            }
        })
    }

    public get companyItems(): Company[] {
        var currentCompanyType = <CompanyTypes>(this.formFilter.controls["companyType"].value);
        switch (currentCompanyType) {
            case CompanyTypes.Company:
                return this.companies.filter(f => !f.isOperationalUnit);
            case CompanyTypes.OperationalUnit:
                return this.companies.filter(f => f.isOperationalUnit);
            default:
                return this.companies;
        }
    }

    public search = (): void => {
        this.onSearch.emit(<RoadWorkFilters>this.formFilter.getRawValue());
        this.clearParams();
        this.searchExpansionPanel.close();
    }

    public reset = (): void => {
        this.formFilter.controls["neighborhood"].setValue([]);
        this.formFilter.controls["roadwayName"].setValue([]);
        this.formFilter.controls["description"].setValue([]);
        this.formFilter.controls["status"].setValue([]);
        this.formFilter.controls["priorities"].setValue([]);
        this.formFilter.controls["isOverlap"].setValue([]);
        this.formFilter.controls["addressName"].setValue([]);
        this.formFilter.controls["effectiveStartDateFrom"].setValue(null);
        this.formFilter.controls["effectiveStartDateTo"].setValue(null);
        this.formFilter.controls["effectiveEndDateFrom"].setValue(null);
        this.formFilter.controls["effectiveEndDateTo"].setValue(null);
        this.formFilter.controls["companyType"].setValue([]);
        this.formFilter.controls["categories"].setValue([]);
        this.formFilter.controls["visibleType"].setValue([]);
        this.formFilter.controls["publishStatus"].setValue([]);
        if (this.companies.length > 1) {
            this.formFilter.controls["companyId"].setValue([]);
        }
        this.clearParams();
        this.search();
    }

    private clearParams() {

        this.router.navigate([], {
            queryParams: {
                'criteria': null
            },
            queryParamsHandling: 'merge'
        });
        this.lastFilter = null;
    }

    public newCriteria() {

        if (this.lastFilter != null) {
            let objParsed = JSON.parse(this.lastFilter);
            this.formFilter.controls["companyId"].setValue(objParsed.companyId);
            this.formFilter.controls["neighborhood"].setValue(objParsed.neighborhood);
            this.formFilter.controls["roadwayName"].setValue(objParsed.roadwayName);
            this.formFilter.controls["description"].setValue(objParsed.description);
            this.formFilter.controls["status"].setValue(objParsed.status);
            this.formFilter.controls["priorities"].setValue(objParsed.priorities);
            this.formFilter.controls["isOverlap"].setValue(objParsed.isOverlap);
            this.formFilter.controls["addressName"].setValue(objParsed.addressName);
            this.formFilter.controls["effectiveStartDateFrom"].setValue(objParsed.effectiveStartDateFrom);
            this.formFilter.controls["effectiveStartDateTo"].setValue(objParsed.effectiveStartDateTo);
            this.formFilter.controls["effectiveEndDateFrom"].setValue(objParsed.effectiveEndDateFrom);
            this.formFilter.controls["effectiveEndDateTo"].setValue(objParsed.effectiveEndDateTo);
            //this.formFilter.controls["companyType"].setValue(objParsed.companyType);
            this.formFilter.controls["categories"].setValue(objParsed.categories);
            this.formFilter.controls["visibleType"].setValue(objParsed.visibleType);
            this.formFilter.controls["publishStatus"].setValue(objParsed.publishStatus);
        }
    }

    ngOnDestroy(): void {
        this.destrorySubscription();
    }

    private destrorySubscription = (): void => {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    public export = (excel: boolean): void => {
        this._eventBusService.showSpinner.emit(true);
        let aa = (<RoadWorkFilters>this.formFilter.getRawValue());
        this._roadWorkService.getFilteredWorks(excel, aa).subscribe(result => {
            this.createLink(result);
            this._eventBusService.showSpinner.emit(false);

        });

    }

    private createLink = (url: string): void => {
        var a = document.createElement('a');
        a.href = url;
        a.download = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

    public get canManageOffice() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_PressOffice);
    }
}

