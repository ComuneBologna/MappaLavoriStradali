
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Period } from 'app/models/models';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigurationService {
    constructor(private _httpService: HttpService) {
    }

    public getPeriods = (): Observable<Period[]> => {
        return this._httpService.get('/configurations').pipe(map(result => 
            result.items
        ));
    }    

    public getPeriodById = (id: number): Observable<Period> => {
        return this._httpService.get(`/configurations/${encodeURIComponent(id.toString())}`);
    }


    public delete = (id: number): Observable<any> => {
        return this._httpService.delete(`/configurations/${id}`);
    }

    public save = (data: Period): Observable<any> => {
        if (data.id) {
            return this._httpService.put('/configurations/' + encodeURIComponent(data.id.toString()), data);
        }
        else {
            return this._httpService.post('/configurations', data);
        }
    }
}
