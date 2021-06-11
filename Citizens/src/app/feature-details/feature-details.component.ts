import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomFeature } from '../customFeature';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit, OnChanges {
  @Input() feature: CustomFeature;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
  }
}
