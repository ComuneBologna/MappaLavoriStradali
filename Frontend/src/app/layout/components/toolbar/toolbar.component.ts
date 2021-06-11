import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Settings } from 'app/models/models';
import { SecurityService } from 'app/services/security.service';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent {
    constructor(private _fuseSidebarService: FuseSidebarService, private _securityService: SecurityService) {
    }

    public toggleSidebarOpen = (key): void => {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    public get name() {
        return Settings.user.name;
    }

    public get initials() {
        let parts = Settings.user.name.split(" ").filter(f => f);
        if (parts.length >= 2) {
            return parts[0].substr(0, 1) + " " + parts[1].substr(0, 1);
        }
        if (parts.length == 1) {
            return parts[0].substr(0, 2);
        }
        return null;
    }

    public logout = (): void => {
        this._securityService.logOut();
    }
}
