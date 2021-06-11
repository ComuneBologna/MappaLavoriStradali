import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { tap } from 'rxjs/operators';
import { Settings } from 'app/models/models';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(protected _securityService: SecurityService, protected _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this._securityService.isAuthenticated) {
            this._securityService.startLogin();
            return false;
        }
        else {
            if (Settings.authorities.length == 0) {
                this._router.navigate(['error', 403]);
                return false;
            }
        }
        return true;
    }
}