import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectedFeatureComponent } from './list-selected-feature.component';

describe('ListSelectedFeatureComponent', () => {
  let component: ListSelectedFeatureComponent;
  let fixture: ComponentFixture<ListSelectedFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSelectedFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectedFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
