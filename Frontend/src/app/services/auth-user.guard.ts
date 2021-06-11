import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { AuthGuard } from './auth.guard';
import { Settings } from 'app/models/models';

@Injectable()
export class AuthUserGuard extends AuthGuard {

    constructor(securityService: SecurityService, routerService: Router) {
        super(securityService, routerService)
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (super.canActivate(next, state)) {
            return true;
        }
        return false;
    }
}