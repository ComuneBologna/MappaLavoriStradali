import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { EnumUtils } from 'app/common/utils/enum.util';
import { DeleteDialogComponent } from 'app/components/dialogs/delete-dialog.component';
import { BackofficeUser, BackofficeUserItem, PermissionCodes, Settings } from 'app/models/models';
import { EventBusService } from 'app/services/event-bus.service';
import { UsersService } from 'app/services/users.service';
import { UserComponent } from './user.component';



@Component({
    selector: 'users',
    templateUrl: './users.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class UsersPage {

    public dataSource: MatTableDataSource<BackofficeUserItem>;
    public enumUtils: EnumUtils = EnumUtils;
    public filter: string;
    public users: BackofficeUserItem[] = null;
    public canManage: boolean = false;

    public displayedColumns = ['lastName', 'firstName', 'fiscalCode', 'email', 'companyName', 'actions'];

    constructor(private _dialog: MatDialog, private _usersService: UsersService, private _eventBusService: EventBusService) {
        this.canManage = Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource([]);
        this.loadData();
    }


    public search = (reload: boolean): void => {
        if (reload) {
            this.users = null;
        }
        this.loadData();
    }

    private loadData = (): void => {
        this._usersService.getUsers().subscribe(result => {
            this.dataSource.data = [...result];
            if (this.filter) {
                let ret = [...this.users];
                let filter = this.filter.trim();
                ret = ret.filter(f => f.email.toLocaleLowerCase().indexOf(filter) >= 0 || f.lastName.toLocaleLowerCase().indexOf(filter) >= 0 || f.firstName.toLocaleLowerCase().indexOf(filter) >= 0 || f.fiscalCode.toLocaleLowerCase().indexOf(filter) >= 0);
            }
        });
    }

    public add = (): void => {
        this.manage(null);
    }

    public edit = (row: string): void => {
        this.manage(row);
    }

    private manage = (id?: string): void => {
        this._dialog.open(UserComponent, {
            panelClass: "modal-xl",
            data: { id: id }
        }).afterClosed().subscribe(result => {
            if (result)
                this.search(true);
        });
    }

    public startDelete = (userId: string): void => {
        this._dialog.open(DeleteDialogComponent, {
            width: '350px',
            data: { title: 'Cancellazione sede' }
        }).afterClosed().subscribe(result => {
            if (result)
            this._eventBusService.showSpinner.emit(true);
                this._usersService.delete(userId).subscribe(result => {
                    this._eventBusService.showSpinner.emit(false);
                    this.search(true);
                });
        });
    }

}