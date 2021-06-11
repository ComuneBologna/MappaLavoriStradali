import { Component } from '@angular/core';
import { GeoFeatureContainer } from 'src/app/models/GeoFeature';
import { HttpClient } from '@angular/common/http';
import { RoadWorkDetail, RoadWorkStatus, Settings } from './models/models';
import { EnumUtils } from './EnumUtils';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { RoadWorksMapDetailComponent } from './my-components/dialog/road-works-map-detail.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    enumUtils = EnumUtils;

    private labeledPoints = [{
        "label": 4321,
        "coordinates": [{ "latitude": 44.494268552816896, "longitude": 11.343615632504225 }]
    }
        , {
        "label": 4444,
        "coordinates": [{ "latitude": 44.499268552816896, "longitude": 11.323615632504225 }]
    }
    ]

    features = [];
    get validAuthority() {
        return Settings.user.currentAuthority != null;
    }

    constructor(private http: HttpClient, private _dialog: MatDialog) { }
    // selectedGeoId(event) {
    // 	let index = this.data.findIndex((element) => {return element.id==event});
    // 	if (index >= 0) {
    // 		this.selectedDataModel = this.data[index];
    // 	}
    // 	else {
    // 		this.selectedDataModel = null;
    // 	}


    // }

    public selectedGeoId = (event: any): void => {
        let index = this.data.findIndex((element) => { return element.id == event });
        if (index >= 0) {
            const dialogRef = this._dialog.open(RoadWorksMapDetailComponent, {
                data: this.data[index],
                width: '60%',
            });
        }



    }

    featuresUpdated(event) {
    }
    startedWorks: any = {};
    selectedDataModel: RoadWorkDetail;
    data: RoadWorkDetail[] = [];
    ngOnInit() {
        this.http.get(environment.apiUrl + "/RoadWorks/citizens").subscribe((responseData: RoadWorkDetail[]) => {
            let work: RoadWorkDetail[] = [];
            let features = [];
            if (responseData) {
                let started: any = {};
                responseData.forEach(element => {
                    let newWork: RoadWorkDetail = new RoadWorkDetail();
                    Object.assign(newWork, element);
                    if (newWork.status == RoadWorkStatus.ComingSoon || newWork.status == RoadWorkStatus.NotStarted || newWork.status == RoadWorkStatus.InProgress || RoadWorkStatus.Completed ) {
                        started["" + newWork.id] = newWork;
                        if(newWork.status == RoadWorkStatus.Completed){
                            newWork.status = RoadWorkStatus.InProgress;
                        }
                        if (newWork.status == RoadWorkStatus.ComingSoon)
                            newWork.status = RoadWorkStatus.NotStarted;
                        let container: GeoFeatureContainer = new GeoFeatureContainer();
                        container = JSON.parse((<any>newWork).geoFeatureContainer);
                        container.id = "" + newWork.id;
                        newWork.geoFeatureContainer = container;
                        features.push(container);
                        if (newWork.companyIsOperationalUnit == true) {
                            newWork.companyName = Settings.user.currentAuthority.name;
                        }
                        work.push(newWork);
                    }
                });
                this.startedWorks = started;
            }
            this.features = features;
            this.data = work;
        })
    }
    closeInfo() {
        this.selectedDataModel = null;
    }



}
