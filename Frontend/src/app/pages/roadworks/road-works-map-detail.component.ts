import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoadWorkMapItem, OverlapTypes, RoadWorkStatus, PriorityTypes, NotPlannedCategoryStatus, RoadWorkAttachmentInfo, Settings, RoadWorkCategories, PermissionCodes } from 'app/models/models';
import { EnumUtils } from 'app/common/utils/enum.util';
import { Observable } from 'rxjs';
import { RoadWorkService } from 'app/services/road-works.service';
import { EventBusService } from 'app/services/event-bus.service';

@Component({
    selector: 'road-works-map-detail',
    templateUrl: 'road-works-map-detail.component.html',
})
export class RoadWorksMapDetailComponent implements OnInit {
    public enumUtils: EnumUtils = EnumUtils;
    public attachments: Attachment[] = [];
    public setCriteria: string;
	public showCompactTrafficChangesMeasure: boolean = true;
    public showDetail: boolean = false;
    

    constructor(@Inject(MAT_DIALOG_DATA) public data: RoadWorkMapItem, private roadworkService: RoadWorkService) {

    }

    ngOnInit(): void {
        this.roadworkService.getAttachments(this.data.id).subscribe(s => {
            this.attachments = s.map(m => {
                return {
                    info: m,
                    getUrl: this.roadworkService.getTokenizedUrl(m.id)
                }
            });
        });
    }

    public getOverlap = (isOverlap): any => {
        return isOverlap ? 'Si' : 'No';
    }

    public getStatus = (status?: RoadWorkStatus): string => {
        return EnumUtils.getStatusDescription(status);
    }

    public getPriority = (priority?: PriorityTypes): string => {
        return EnumUtils.getPriorityDescription(priority);
    }

    public getNotPlanned = (notScheduledStatus?: NotPlannedCategoryStatus): string => {
        return EnumUtils.getNotPlannedCategoryStatusDescription(notScheduledStatus);
    } 
   
    public gotoEdit = (): string => {
        if (this.canManage || this.canManageOffice) {
            return this.data.category == RoadWorkCategories.Scheduled ? "/roadwork/scheduled" : "/roadwork/noscheduled";
        }
        else {
            return "/roadwork/user";
        }
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

    public get canManageOffice() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_PressOffice);
    }
    public get showDates(): boolean {
		if (this.data) {
			return ((this.data.addressNumberFrom && this.data.addressNumberTo))? true:false;
		}
		return false;
	}
    public get setSerchCriteriaString() {     
        
        this.setCriteria = JSON.stringify(this.data)
        return this.setCriteria;
    }
   
    public imageStatus(){
        switch(this.data.category){
            case RoadWorkCategories.Planned:
                return '<img src="assets/icons/maps/work_viola_modificato.png">'
                default:
                    switch (this.data.status) {
                        case RoadWorkStatus.Completed:
                            return '<img src="assets/icons/maps/work_verde_modificato.png">'
                        case RoadWorkStatus.NotStarted:
                            return '<img src="assets/icons/maps/work_azzurro_modificato.png">'
                        case RoadWorkStatus.ComingSoon:
                            return '<img src="assets/icons/maps/work_giallo_modificato.png">'
                        case RoadWorkStatus.InProgress:
                            return '<img src="assets/icons/maps/work_rosso_modificato.png">'
                    }
                return '<img src="assets/icons/maps/work_grigio_modificato.png">'
        }
    }

    public displayInfoCitizen(){
        this.showDetail = !this.showDetail;
    }

    public get showDatesCitizen(): boolean {
		if (this.data) {
			return (
				(this.data.estimatedEndDate && this.data.estimatedStartDate)
				|| 
				(this.data.effectiveStartDate && this.data.effectiveEndDate))? true:false;
		}
		return false;
	}
	public get startDate(): any {
		if (this.data) {
			if (this.data.effectiveStartDate) return this.data.effectiveStartDate;
			if (this.data.estimatedStartDate) return this.data.estimatedStartDate;
		}
	}
	public get endDate(): any {
		if (this.data) {
			if (this.data.effectiveEndDate) return this.data.effectiveEndDate;
			if (this.data.estimatedEndDate) return this.data.estimatedEndDate;
		}
	}

	public onTrafficChangesMeasureClicked() {
		this.showCompactTrafficChangesMeasure = !this.showCompactTrafficChangesMeasure;
	}

    /* info cittadino */
    public get extendedAddressName() {
        if (this.data.addressNumberFrom && this.data.addressNumberTo)
            return this.data.address + " dal civico " + this.data.addressNumberFrom + " al civico " + this.data.addressNumberTo;
        else if (!this.data.addressNumberFrom && this.data.addressNumberTo)
            return this.data.address + " dal civico 1 al civico " + this.data.addressNumberTo;
        else if (this.data.addressNumberFrom && !this.data.addressNumberTo)
            return this.data.address + " dal civico " + this.data.addressNumberFrom;
        else
            return this.data.address;
    }
    public get referredLink(): string {
        if (this.data.link) {
            if (this.data.link.indexOf("http://") < 0 && this.data.link.indexOf("https://") < 0)
                return "http://" + this.data.link;
        }

        return this.data.link;
    }
}

class Attachment {
    public info: RoadWorkAttachmentInfo = null;
    public getUrl: Observable<string> = null;
}