import { AfterViewInit, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { CompaniesService } from 'app/services/companies.service';
import { Company, PermissionCodes, Settings } from 'app/models/models';
import { EventBusService } from 'app/services/event-bus.service';

export abstract class BaseCompaniesPage implements OnInit, AfterViewInit {
    public dataSource: MatTableDataSource<Company>;
    public displayedColumns = ['id', 'name', 'actions'];
    public abstract icon: string;
    public abstract title: string;
    public abstract addUrl: string;

    constructor(protected _companiesService: CompaniesService, private _dialog: MatDialog, private isOperationalUnit, private deleteMessage: string , private _eventBusService: EventBusService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource([]);
    }

    ngAfterViewInit(): void {
        this.loadData();
    }

    protected loadData = (): void => {
        this._companiesService.getCompanies(this.isOperationalUnit).subscribe(result => {
            this.dataSource.data = [...result];
        });
    }


    public startDelete = (id: number): void => {
        this._dialog.open(DeleteDialogComponent, {
            width: '350px',
            data: { title: this.deleteMessage }
        }).afterClosed().subscribe(result => {
            if (result)
                this.delete(id);
        });
    }

    protected delete = (id: number): void => { }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}

