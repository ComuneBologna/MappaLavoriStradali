
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RoadWorkItem, SearchResult, Company, RoadWorkWrite, RoadWorkDetail, Roadway, SearchCriteria, RoadWorkFilters, RoadWorkMapItem, AddressNumber, RoadWorkAttachmentInfo, Settings, Coordinate, AuditInfo, Years, ClosestCoordinate, Log, LogFilter, PermissionCodes, AddressNumberAPI } from 'app/models/models';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { GeoFeature, GeoFeatureContainer } from 'app/models/GeoFeature';
import { formatDate } from '@angular/common';
import { DatetimeUtils } from 'app/utils/datetime.utils';
import * as moment from 'moment';
import { environment } from 'environments/environment';

@Injectable()
export class RoadWorkService {
    constructor(private _httpService: HttpService) {
    }

    public getData = (data: RoadWorkFilters, pageIndex: number, pageSize: number): Observable<SearchResult<RoadWorkItem>> => {
        let params = this.objectToUrl(data);
        params = params.set('pageNumber', pageIndex.toString());
        params = params.set('itemsPerPage', pageSize.toString());
        let url = '/roadworks' + this.arrayToUrl(data.categories, "categories");
        return this._httpService.get(url, params);
    }

    public getMapData = (data: RoadWorkFilters): Observable<SearchResult<RoadWorkMapItem>> => {
        let params = this.objectToUrl(data);
        params = params.set('pageIndex', "1");
        params = params.set('itemsPerPage', "10000000");
        let url = '/roadworks/map' + this.arrayToUrl(data.categories, "categories");

        return this._httpService.get(url, params).pipe(tap(result => {
            for (let i = 0; i < result.items.length; i++) {
                result.items[i].geoFeatureContainer = this.adjustGeoFeatureContainer(result.items[i]);
            }
        }));
    }

    public getPressOfficeWorks = (data: RoadWorkFilters, pageIndex: number, pageSize: number): Observable<SearchResult<RoadWorkItem>> => {
        let params = this.objectToUrl(data);
        params = params.set('pageNumber', pageIndex.toString());
        params = params.set('itemsPerPage', pageSize.toString());
        let url = '/pressoffice/roadworks';
        return this._httpService.get(url, params);
    }

    public updateByPressOffice = (data: RoadWorkWrite): Observable<any> => {
        return this._httpService.put(`/PressOffice/roadworks/${data.id}`, data);
    }

    public getMapPressOffice = (data: RoadWorkFilters): Observable<SearchResult<RoadWorkMapItem>> => {
        let params = this.objectToUrl(data);
        params = params.set('pageIndex', "1");
        params = params.set('itemsPerPage', "10000000");
        let url = '/pressoffice/roadworks/map' + this.arrayToUrl(data.categories, "categories");

        return this._httpService.get(url, params).pipe(tap(result => {
            for (let i = 0; i < result.items.length; i++) {
                result.items[i].geoFeatureContainer = this.adjustGeoFeatureContainer(result.items[i]);
            }
        }));
    }

    public getById = (id: number): Observable<RoadWorkDetail> => {
        return this._httpService.get(`/roadworks/${id}`).pipe(tap(result => {
            result.geoFeatureContainer = this.adjustGeoFeatureContainer(result);
        }));
    }

    public getAuditInfo = (id: number): Observable<AuditInfo> => {
        return this._httpService.get(`/roadworks/audit/${id}`);
    }

    private adjustGeoFeatureContainer = (value: any): GeoFeatureContainer => {
        if (value.geoFeatureContainer) {
            value.geoFeatureContainer = <GeoFeatureContainer>(JSON.parse(value.geoFeatureContainer));
        }
        else {
            value.geoFeatureContainer = new GeoFeatureContainer();
        }
        value.geoFeatureContainer.id = value.id.toString();
        value.geoFeatureContainer.label = value.address;
        return value.geoFeatureContainer;
    }

    public delete = (id: number): Observable<any> => {
        return this._httpService.delete(`/roadworks/${id}`);
    }

    public closestRoadworks = (coordinate: ClosestCoordinate): Observable<RoadWorkMapItem[]> => {
        let data = this.objectToUrl(coordinate);
        return this._httpService.get(`/roadworks/closestworks`, data).pipe(tap((results: any[]) => {
            for (let i = 0; i < results.length; i++) {
                results[i].geoFeatureContainer = this.adjustGeoFeatureContainer(results[i]);
            }
        }));;
    }


    public getWorksToActivate = (excel: boolean): Observable<string> => {
        return this._httpService.get(`/roadworks/csv/worktoactivate?excel=${excel}`);
    }

    public getWorksInProgress = (excel: boolean): Observable<string> => {
        return this._httpService.get(`/roadworks/csv/workinprogress?excel=${excel}`);
    }

    public getFilteredWorks = (excel: boolean, roadworkFilters: RoadWorkFilters): Observable<string> => {
        let data = this.objectToUrl({
            Id: roadworkFilters.id,
            CompanyId: roadworkFilters.companyId,
            CompanyType: roadworkFilters.companyType,
            VisibleType: roadworkFilters.visibleType,
            YearFrom: roadworkFilters.yearFrom,
            YearTo: roadworkFilters.yearTo,
            Neighborhood: roadworkFilters.neighborhood,
            RoadwayName: roadworkFilters.roadwayName,
            Status: roadworkFilters.status,
            Priorities: roadworkFilters.priorities,
            IsOverlap: roadworkFilters.isOverlap,
            Description: roadworkFilters.description,
            AddressName: roadworkFilters.addressName,
            EffectiveStartDateFrom: roadworkFilters.effectiveStartDateFrom,
            EffectiveStartDateTo: roadworkFilters.effectiveStartDateTo,
            EffectiveEndDateFrom: roadworkFilters.effectiveEndDateFrom,
            EffectiveEndDateTo: roadworkFilters.effectiveEndDateTo,

            excel: excel,
        })
        let url = `/roadworks/csv/export` + this.arrayToUrl(roadworkFilters.categories, "categories");

        return this._httpService.get(url, data);
    }

    public save = (data: RoadWorkWrite): Observable<any> => {
        if (data.id) {
            return this._httpService.put('/roadworks/' + encodeURIComponent(data.id.toString()), data);
        }
        else {
            return this._httpService.post('/roadworks', data);
        }
    }

    public getYears = (all: boolean): Observable<Years[]> => {
        // let data = this.objectToUrl({
        //     all: all
        // });
        return this._httpService.get('/roadworks/years');
    }

    public searchAddress = (address: string): Observable<string[]> => {
        let data = this.objectToUrl({
            authorityId: Settings.user.currentAuthority.authorityId,
            addressFullTextSearch: address
        });
        return this._httpService.get(environment.placeNameUrl + '/PlaceName/addresses', data);
    }

    public getCivics = (address: string): Observable<AddressNumber[]> => {
        let data = this.objectToUrl({
            authorityId: Settings.user.currentAuthority.authorityId,
            addressName: address
        });
        return this._httpService.get(environment.placeNameUrl + '/PlaceName/addresses/numbers', data).pipe(map((result: AddressNumberAPI[]) => {
            var newAddress: AddressNumber[] = new Array();
            result.forEach(x => {
                let neighborhoodId = null;
                if (x != null && x.neighborhood != null) {
                    neighborhoodId = x.neighborhood.id
                }
                newAddress.push({
                    latitude: x.mapPoint.latitude,
                    longitude: x.mapPoint.longitude,
                    neighborhood: neighborhoodId,
                    number: x.number
                });
            })
            return newAddress;
        }));
    }

    public getAttachments = (roadworkId: number): Observable<RoadWorkAttachmentInfo[]> => {
        let data = {
            roadworkId: roadworkId
        };
        let params = this.objectToUrl(data);
        params = params.set('pageNumber', "1");
        params = params.set('itemsPerPage', "99999999");

        return this._httpService.get('/roadworks/attachments', params).pipe(map(m => {
            return m.items;
        }));
    }

    public uploadAttachment = (file: File): Observable<RoadWorkAttachmentInfo> => {
        return this._httpService.uploadFile('/roadworks/attachments', file);
    }

    public getTokenizedUrl = (roadworkId: number): Observable<string> => {
        if (this.canManage) {
            return this._httpService.get(`/roadworks/attachments/${roadworkId}`);
        }
        else {
            return this._httpService.get(`/roadworks/citizens/attachments/${roadworkId}`);
        }
    }

    public getLogs = (data: LogFilter): Observable<SearchResult<Log>> => {

        let params = this.objectToUrl(data);
        params = params.set('pageNumber', "1");
        params = params.set('itemsPerPage', "99999999");
        if (data != null && data.migrationDate != null) {
            params = params.set('migrationDate', moment.utc(data.migrationDate).local().format('YYYY-MM-DD'));
        }
        return this._httpService.get('/roadworks/import/logs', params);
    }

    public getLogsById = (id: number): Observable<string> => {
        return this._httpService.get(`/roadworks/import/logs/${id}`);
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

    private arrayToUrl = (value: any[], paramName: string): string => {
        let ret = '';
        if (value != null && value.length) {
            ret = "?" + paramName + "=" + value.join('&' + paramName + "=");
        }
        return ret;
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}
