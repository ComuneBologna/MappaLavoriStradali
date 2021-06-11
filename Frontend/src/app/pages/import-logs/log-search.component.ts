import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { RoadWorkService } from '../../services/road-works.service';
import { Company, LogFilter, PermissionCodes, Settings } from 'app/models/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { CompaniesService } from 'app/services/companies.service';
import { MatExpansionPanel } from '@angular/material';

@Component({
    selector: 'log-search',
    templateUrl: './log-search.component.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class LogSearchComponent implements OnInit, OnDestroy {

    public formFilter: FormGroup;
    public companies: Company[] = [];
    public enumUtils: EnumUtils = EnumUtils;
    public subscription: Subscription = null;
    public panelOpenState: boolean = false;

    @ViewChild("searchPanel", { static: false }) public searchExpansionPanel: MatExpansionPanel;

    @Input() public autoSearch: boolean = true;
    @Input()
    public set filters(filters: LogFilter) {
        filters = filters || new LogFilter();
        this.formFilter = this._formBuilder.group({
            companyId: [filters.companyId],
            migrationDate: [filters.migrationDate],
        });

        this.destrorySubscription();

    }
    @Output() public onSearch: EventEmitter<LogFilter> = new EventEmitter<LogFilter>();

    constructor(private _companiesService: CompaniesService, private _formBuilder: FormBuilder) {
        this.filters = new LogFilter();
    }

    ngOnInit(): void {
        this.companyItems()
        if (this.autoSearch) {
            this.search();
        }
    }

    public companyItems() {
        this._companiesService.getCompanies().subscribe(result => {
            if (result)
                this.companies = result;
        });
    }

    public search = (): void => {
        this.onSearch.emit(<LogFilter>this.formFilter.getRawValue());
    }

    public reset = (): void => {
        this.formFilter.controls["migrationDate"].setValue(null);

        if (this.companies.length > 1) {
            this.formFilter.controls["companyId"].setValue([]);
        }
        this.search();
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

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

}

