import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { SecurityService } from 'app/services/security.service';


@Component({
    selector: 'login',
    templateUrl: './login.page.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginPage {
    constructor(private securityService: SecurityService) {
        this.securityService.startLogin();
    }
}
