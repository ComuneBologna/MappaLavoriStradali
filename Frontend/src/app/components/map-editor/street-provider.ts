import { fromLonLat, toLonLat } from 'ol/proj';
import { environment } from 'environments/environment';
import { Settings } from 'app/models/models';

export class StreetProvider {
    private url: string = environment.apiStreetUrl;
    // private url: string = environment.apiUrl+ "/RoadWorks/map/address";
    public getParameters(opt) {
        return {
            url: this.url,
            params: {
                AuthorityId: Settings.user.currentAuthority.authorityId,
                addressFullTextSearch: opt.query,
                format: "json"
            }
        }
    }

    public handleResponse(results) {
        if (results && results.length > 0) {
            return results.map(function (feature) {
                return {
                    lon: feature.point.longitude,
                    lat: feature.point.latitude,
                    address: {
                        name: feature.addressName,
                    },
                };
            });
        }
        else {
            return [];
        }
    }
}