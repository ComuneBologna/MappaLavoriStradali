import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { settings } from 'cluster';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { PermissionCodes, Settings } from 'app/models/models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'environments/environment';

@Component({
    selector: 'authority-choicer',
    templateUrl: './authority-choicer.component.html',
    styleUrls: ['./authority-choicer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthorityChoicerComponent implements OnInit {
    private _lastId = null;
    constructor(private _fuseNavigationService: FuseNavigationService, private _router: Router, private _oauthService: OAuthService, private _http: HttpClient) {
    }
    ngOnInit(): void {
        this.setAuthority(this.currentValue, false);
    }
    public get authorities() {
        return Settings.authorities;
    }
    public get currentValue() {
        return Settings.user.currentAuthority ? Settings.user.currentAuthority.authorityId : null;
    }

    public setAuthority = (id: number, navigate: boolean = true): void => {
        if (this._lastId != id) {
            Settings.user.currentAuthority = Settings.authorities.find(f => f.authorityId == id);
            this.getPermissions().subscribe(result => {
                let menuPermission = ""
                for (let permission in PermissionCodes) {
                    if (result.indexOf(<PermissionCodes>permission) >= 0) {
                        menuPermission = permission;
                        break;
                    }
                }
                Settings.user.permissions = [...result];
                sessionStorage.setItem("authorityId", id.toString());
                this._fuseNavigationService.setCurrentNavigation(menuPermission);
                if (navigate) {
                    this._router.navigateByUrl("/");
                }
            });
            this._lastId = id;
        }
    }

    private getPermissions = (): Observable<PermissionCodes[]> => {
        let headers = new HttpHeaders();
        headers = headers.set("Authorization", "Bearer " + this._oauthService.getAccessToken());
        headers = headers.set("AuthorityId", Settings.user.currentAuthority.authorityId.toString());
        return this._http.get<PermissionCodes[]>(environment.apiUrl + '/BackofficeUsers/MyRoles', { headers: headers });
    }
}
