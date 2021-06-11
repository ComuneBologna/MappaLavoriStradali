import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { BackofficeUser, BackofficeUserItem, BackofficeUserWrite, Role } from 'app/models/models';


@Injectable()
export class UsersService {
    constructor(private _httpService: HttpService) {
    }

    public getUsers = (): Observable<BackofficeUserItem[]> => {
        return this._httpService.get("/backofficeusers/users");
    }

    public getUser = (id: string): Observable<BackofficeUser> => {
        return this._httpService.get(`/backofficeusers/users/${encodeURIComponent(id)}`);
    }

    public save = (data: BackofficeUserWrite, id: string = null): Observable<any> => {
        if (id) {
            return this._httpService.put(`/backofficeusers/users/${id}`, data);
        }
        else {
            return this._httpService.post('/backofficeusers/users', data);
        }
    }

    public delete = (userId: string): Observable<any> => {
        return this._httpService.delete(`/backofficeusers/users/${encodeURIComponent(userId)}`);
    }

    public getRoles = (): Observable<Role[]> => {
        return this._httpService.get("/backofficeusers/roles");
    }

}