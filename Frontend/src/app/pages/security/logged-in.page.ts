import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { SecurityService } from 'app/services/security.service';


@Component({
    selector: 'logged-in',
    templateUrl: './logged-in.page.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoggedinPage {
    constructor(private securityService: SecurityService) {
        this.securityService.startLogin();
    }
}
