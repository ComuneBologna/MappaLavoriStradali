import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { PermissionCodes, Settings } from 'app/models/models';


@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardPage {
    public get name() {
        return Settings.user.name;
    }
    public canImport: boolean = false;
    public isTenantAdmin: boolean = false;
    constructor() {
        this.canImport = Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
        this.isTenantAdmin = Settings.user.hasPermission(PermissionCodes.Tenant_Admin);
    }
}
