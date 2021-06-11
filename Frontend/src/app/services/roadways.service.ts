
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Roadway } from 'app/models/models';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class RoadWaysService {
    constructor(private _httpService: HttpService) {
    }

    public getRoadways = (): Observable<Roadway[]> => {
        return this._httpService.get('/roadways').pipe(map(result => 
            result.items
        ));
    }    

    public getRoadwayById = (id: number): Observable<Roadway> => {
        return this._httpService.get(`/roadways/${encodeURIComponent(id.toString())}`);
    }


    public delete = (id: number): Observable<any> => {
        return this._httpService.delete(`/roadways/${id}`);
    }

    public save = (data: Roadway): Observable<any> => {
        if (data.id) {
            return this._httpService.put('/roadways/' + encodeURIComponent(data.id.toString()), data);
        }
        else {
            return this._httpService.post('/roadways', data);
        }
    }
}
