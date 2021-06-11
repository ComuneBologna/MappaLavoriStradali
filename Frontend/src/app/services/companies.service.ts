
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Company, NewCompany, NewCompanyUserInfo } from 'app/models/models';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CompaniesService {
    constructor(private _httpService: HttpService ) {
    }

    public getCompanies = (isOperationalUnit: boolean = null): Observable<Company[]> => {
        let url = '/companies';
        if (isOperationalUnit != null) {
            url = url + '?isOperationalUnit=' + isOperationalUnit;
        }
        return this._httpService.get(url).pipe(map(result => 
            result.items
        ));
    }

    public getCompanyById = (id: number): Observable<Company> => {
        return this._httpService.get(`/companies/${encodeURIComponent(id.toString())}`);
    }

    public getCompanyInfo = (companyId: number): Observable<NewCompanyUserInfo> => {
        return this._httpService.get(`/Companies/${companyId}/account/info`);
    }

    public getMyCompany = (): Observable<Company> => {
        return this._httpService.get('/companies/mycompany');
    }


    public delete = (id: number): Observable<any> => {
        return this._httpService.delete(`/companies/${id}`);
    }

    public add = (data: NewCompany): Observable<number> => {
        return this._httpService.post('/companies', data);
    }

    // public update = (data: NewCompany): Observable<any> => {
    //     return this._httpService.put('/companies/' + encodeURIComponent(data.id.toString()), data);
    // }

    public save = (data: NewCompany): Observable<any> => {
        if (data.id) {
            return this._httpService.put('/companies/' + encodeURIComponent(data.id.toString()), data);
        }
        else {
            return this._httpService.post('/companies', data);
        }
    }
}
