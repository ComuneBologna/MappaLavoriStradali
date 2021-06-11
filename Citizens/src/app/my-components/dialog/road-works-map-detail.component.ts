import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RoadWorkMapItem } from 'src/app/models/models';
import { EnumUtils } from 'src/app/EnumUtils';

@Component({
    selector: 'road-works-map-detail',
    templateUrl: 'road-works-map-detail.component.html',
})
export class RoadWorksMapDetailComponent implements OnInit {
   
	showCompactVisualizationNotes: boolean = true;
	showCompactTrafficChangesMeasure: boolean = true;

	enumUtils = EnumUtils;
	constructor(@Inject(MAT_DIALOG_DATA) public data: RoadWorkMapItem) {

    }

    ngOnInit(): void {
     
	}
	
	public get showDates(): boolean {
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

	public onVisualizationNotesClicked() {
		this.showCompactVisualizationNotes = !this.showCompactVisualizationNotes;
		
	}
	public onTrafficChangesMeasureClicked() {
		this.showCompactTrafficChangesMeasure = !this.showCompactTrafficChangesMeasure;
	}
}
