import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionCodes, Roadway, Settings } from 'app/models/models';
import { EnumUtils } from 'app/common/utils/enum.util';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { RoadWaysService } from 'app/services/roadways.service';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'road-ways',
    templateUrl: './roadways.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoadWaysPage implements OnInit, AfterViewInit {
    public dataSource: MatTableDataSource<Roadway>;
    public enumUtils: EnumUtils = EnumUtils;
    public displayedColumns = ['id', 'name', 'actions'];

    constructor(private _roadWaysService: RoadWaysService, private _dialog: MatDialog, private _eventBusService: EventBusService) {
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
        this._roadWaysService.getRoadways().subscribe(result => {
            this.dataSource.data = [...result];
        });
    }


    public startDelete = (id: number): void => {
        this._dialog.open(DeleteDialogComponent, {
            width: '350px',
            data: { title: 'Cancellazione sede' }
        }).afterClosed().subscribe(result => {
            if (result)
                this.delete(id);
        });
    }

    private delete = (id: number): void => {
        this._eventBusService.showSpinner.emit(true);
        this._roadWaysService.delete(id).subscribe(result => {
            this.loadData();
            this._eventBusService.showSpinner.emit(false);
        });
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}

