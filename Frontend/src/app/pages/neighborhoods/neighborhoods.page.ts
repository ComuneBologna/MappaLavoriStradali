import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Neighborhood, PermissionCodes, Settings } from 'app/models/models';

import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';

@Component({
    selector: 'Neighborhoods',
    templateUrl: './neighborhoods.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class NeighborhoodsPage implements OnInit, AfterViewInit {
    public dataSource: MatTableDataSource<Neighborhood>;
    public enumUtils: EnumUtils = EnumUtils;
    //public displayedColumns = ['id', 'name', 'actions'];
    public displayedColumns = ['name'];

    constructor(private _neighborhoodsService: NeighborhoodsService, private _dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource([]);
    }

    ngAfterViewInit(): void {
        this.search();
    }

    public search = (): void => {
        this.loadData();
    }

    private loadData = (): void => {
        this._neighborhoodsService.getNeighborhoods().subscribe(result => {
            this.dataSource.data = [...result];
        });
    }


    // public startDelete = (id: number): void => {
    //     this._dialog.open(DeleteDialogComponent, {
    //         width: '350px',
    //         data: { title: 'Cancellazione quartiere' }
    //     }).afterClosed().subscribe(result => {
    //         if (result)
    //             this.delete(id);
    //     });
    // }

    // private delete = (id: number): void => {
    //     this._neighborhoodsService.delete(id).subscribe(result => {
    //         this.loadData();
    //     });
    // }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}

