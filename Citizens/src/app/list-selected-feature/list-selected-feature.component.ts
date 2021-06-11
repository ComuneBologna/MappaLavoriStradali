import { Component, OnInit } from '@angular/core';
import {CustomFeature} from '../customFeature';


@Component({
  selector: 'app-list-selected-feature',
  templateUrl: './list-selected-feature.component.html',
  styleUrls: ['./list-selected-feature.component.css']
})
export class ListSelectedFeatureComponent implements OnInit {

  selectedFeatures: Array<CustomFeature>;
  featureToDisplay: CustomFeature;

  constructor() { }

  ngOnInit() {
    this.selectedFeatures = new Array<CustomFeature>();
  }

}
