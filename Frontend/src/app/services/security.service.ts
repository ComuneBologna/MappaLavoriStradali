import { Injectable, Injector } from '@angular/core';
import { environment } from 'environments/environment';
import { OAuthService, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';

import { filter, map, mergeMap, share, tap } from 'rxjs/operators';
import { promise } from 'protractor';
import { User, Settings, Permission, PermissionCodes, Authority } from 'app/models/models';
import { from, merge, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class SecurityService {
    constructor(private _oauthService: OAuthService, private _http: HttpClient) {
        this._oauthService.configure(this.getAuthConfig());
        this._oauthService.tokenValidationHandler = new JwksValidationHandler();
        this._oauthService.setStorage(sessionStorage);
        this._oauthService.setupAutomaticSilentRefresh();
    }

    private getAuthConfig = (): AuthConfig => {
        let fullPath = document.head.baseURI;
        if (fullPath.endsWith("/")) {
            fullPath = fullPath.substr(0, fullPath.length - 1);
        }
        let ret = new AuthConfig();
        ret.issuer = environment.security.issuer;
        ret.redirectUri = fullPath;
        ret.silentRefreshRedirectUri = fullPath + '/assets/authorization/silent-refresh.html'
        ret.clientId = "lavori_stradali";
        ret.responseType = "code"
        ret.scope = 'openid profile lavoristradali offline_access asfappusers asfappprofile asfappcore';
        ret.postLogoutRedirectUri = fullPath;
        return ret;
    }
    public initialize = (): Promise<any> => {
        const tryLogin = from(this._oauthService.loadDiscoveryDocument().then(() =>
            this._oauthService.tryLogin()
        ).then(result => {
            if (this._oauthService.hasValidAccessToken()) {
                return this._oauthService.loadUserProfile();
            }
            else {
                return of(null).toPromise();
            }
        })).pipe(share());


        const noLogged = tryLogin.pipe(filter(result => result == null)).pipe(map(result => {
            return false;
        }));

        const loggedBase = tryLogin.pipe(filter(result => result != null)).pipe(mergeMap(result => {
            let claims = this._oauthService.getIdentityClaims();
            let user = new User();
            user.name = claims['given_name'];
            user.id = claims['sub'];
            Settings.user = user;
            return this.getAuthorities();
        }), mergeMap(result => {
            Settings.authorities = result;
            if (result.length) {
                var lastAuthority = sessionStorage.getItem("authorityId");
                if (lastAuthority) {
                    Settings.user.currentAuthority = result.find(f => f.authorityId == +lastAuthority);
                }
                if (!Settings.user.currentAuthority) {
                    Settings.user.currentAuthority = Settings.authorities[0];
                }
                sessionStorage.setItem("authorityId", Settings.user.currentAuthority.authorityId.toString());
                return this.getPermissions();
            }
            else {
                return of([]);
            }
        }), tap(result => {
            Settings.user.permissions = result;
        }));

        return merge(noLogged, loggedBase).toPromise();
    }


    public getAuthorities = (): Observable<Authority[]> => {
        let headers = new HttpHeaders();
        headers = headers.set("Authorization", "Bearer " + this.getAccessToken());
        return this._http.get<Authority[]>(environment.smartPaCoreUrl + '/BackofficeSecurity/GetAuthorities?application=' + environment.applicationId, { headers: headers });
    }

    public getPermissions = (): Observable<string[]> => {
        let headers = new HttpHeaders();
        headers = headers.set("Authorization", "Bearer " + this.getAccessToken());
        headers = headers.set("AuthorityId", Settings.user.currentAuthority.authorityId.toString());
        return this._http.get<string[]>(environment.apiUrl + '/BackofficeUsers/MyRoles', { headers: headers });
    }

    public get isAuthenticated() {
        return this._oauthService.hasValidAccessToken();
    }

    public startLogin = (): void => {
        return this._oauthService.initCodeFlow();
    }

    public getAccessToken = (): string => {
        return this._oauthService.getAccessToken();
    }

    public logOut = (): void => {
        return this._oauthService.logOut();
    }
}

