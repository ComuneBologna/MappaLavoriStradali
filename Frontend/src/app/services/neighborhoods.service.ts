
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Neighborhood, Settings } from 'app/models/models';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class NeighborhoodsService {
    constructor(private _httpService: HttpService) {
    }

    public getNeighborhoods = (): Observable<Neighborhood[]> => {
        let data = this.objectToUrl({
            authorityId: Settings.user.currentAuthority.authorityId,
        });
        return this._httpService.get(environment.placeNameUrl + '/PlaceName/neighborhoods', data).pipe(map(result =>
            result
        ));
    }

    public getNeighborhoodById = (id: number): Observable<Neighborhood> => {
        return this._httpService.get(environment.placeNameUrl + `/PlaceName/neighborhoods/${encodeURIComponent(id.toString())}`);
    }


    public delete = (id: number): Observable<any> => {
        return this._httpService.delete(environment.placeNameUrl + `PlaceName/authorities/${Settings.user.currentAuthority.authorityId}/neighborhoods/${id}`);
    }

    public save = (data: Neighborhood): Observable<any> => {
        if (data.id) {
            return this._httpService.put(environment.placeNameUrl + `PlaceName/authorities/${Settings.user.currentAuthority.authorityId}/neighborhoods/` + encodeURIComponent(data.id.toString()), data);
        }
        else {
            return this._httpService.post(environment.placeNameUrl + `PlaceName/authorities/${Settings.user.currentAuthority.authorityId}/neighborhoods`, data);
        }
    }

    private objectToUrl = (data: any): HttpParams => {
        let httpParams = new HttpParams();
        if (data != null) {
            Object.keys(data).forEach(function (key) {
                if (data[key] != null) {
                    if (!(data[key] instanceof Array)) {
                        httpParams = httpParams.set(key, data[key]);
                    }
                }
            });
        }
        return httpParams;
    }
}
