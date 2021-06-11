import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { SecurityService } from './security.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, empty } from 'rxjs';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { FormErrorsComponent } from 'app/components/form/form-errors.component';
import { MatDialog } from '@angular/material';
import { Settings } from 'app/models/models';
import { EventBusService } from './event-bus.service';



@Injectable()
export class HttpService {
    constructor(private http: HttpClient, private securityService: SecurityService, private _router: Router, private _dialog: MatDialog , private _eventBusService: EventBusService) {
    }


    public get = <T = any>(url: string, data: any = {}): Observable<T> => {
        let fullUrl = this.getFullUrl(url);
        return this.http.get<T>(fullUrl, { headers: this.getHeaders(), params: data })
            .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
    }

    public post = <T = any>(url: string, data: any): Observable<T> => {
        let fullUrl = this.getFullUrl(url);
        return this.http.post<T>(fullUrl, data, { headers: this.getHeaders() })
            .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
    }

    public put = <T = any>(url: string, data: any): Observable<T> => {
        let fullUrl = this.getFullUrl(url);
        return this.http.put<T>(fullUrl, data, { headers: this.getHeaders() })
            .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
    }

    public delete = <T = any>(url: string): Observable<T> => {
        let fullUrl = this.getFullUrl(url);
        return this.http.delete<T>(fullUrl, { headers: this.getHeaders() })
            .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
    }

    public uploadFile = <T = any>(url: string, file: File): Observable<T> => {
        let fullUrl = this.getFullUrl(url);
        const data: FormData = new FormData();
        data.append('file', file, file.name);
        return this.http.post<T>(fullUrl, data, { headers: this.getHeaders(true) })
            .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
    }

    private getFullUrl = (url: string): string => {
        if (url.toLocaleLowerCase().startsWith("http")) {
            return url;
        }
        return `${environment.apiUrl}${url}`;
    }

    private manageErrors = (err: any, caught: Observable<any>): Observable<any> => {
        this._eventBusService.showSpinner.emit(false);
        console.log(err);
        switch (err.status) {
            case 400:
                let errors = err.error;
                if (!(errors instanceof Array)) {
                    let arr = new Array();
                    if (errors != null) {
                        arr.push(errors.errors);
                    }
                    else {
                        arr.push("Non trovato");
                    }
                    errors = arr;
                }
                this._dialog.open(FormErrorsComponent, {
                    data: errors,
                    width: '30%',
                });
                return throwError(err)
            case 401:
                this.securityService.logOut();
                return empty();
            case 403:
                this._router.navigate(['error', 403]);
                return empty();
            default:
                this._router.navigate(['error', err.status]);
                return empty();
        }
    }

    private getHeaders = (forUpload: boolean = false): HttpHeaders => {
        let ret = new HttpHeaders();
        if (!forUpload) {
            ret = ret.set("Content-Type", "application/json; charset=utf-8");
            ret = ret.set("Accept", "application/json");
        }
        ret = ret.set("Authorization", "Bearer " + this.securityService.getAccessToken());
        ret = ret.set("AuthorityId", Settings.user.currentAuthority.authorityId.toString());
        return ret;
    }

}
