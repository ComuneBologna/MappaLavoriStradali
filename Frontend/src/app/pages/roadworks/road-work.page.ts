import { OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoadWorkService } from '../../services/road-works.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectListitem, Company, RoadWorkWrite, RoadWorkDetail, Roadway, Settings, Neighborhood, AddressNumber, RoadWorkCategories, Coordinate, RoadWorkAttachmentInfo, AuditInfo, RoadWorkMapItem, ClosestCoordinate, PermissionCodes, RoadWorkFilters, PublishStatus } from 'app/models/models';
import { forkJoin, of, Observable, BehaviorSubject } from 'rxjs';
import { CommonValidators } from 'app/common/validators/common.validator';
import { ArrayValidators } from 'app/common/validators/array.validator';
import { CompaniesService } from 'app/services/companies.service';
import { map, mergeMap, flatMap } from 'rxjs/operators';
import { RoadWorkUtils } from './roadwork.utils';
import { RoadWaysService } from 'app/services/roadways.service';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';
import { MatTabChangeEvent, MatAutocompleteSelectedEvent, MatAutocomplete, MatDialog } from '@angular/material';
import { GeoFeatureContainer, LabeledPoint } from 'app/models/GeoFeature';
import '../../common/extensions-methods/array.extensions';
import { RoadWorksMapDetailComponent } from './road-works-map-detail.component';
import { EventBusService } from 'app/services/event-bus.service';

export abstract class RoadWorkPage implements OnInit {
    public form: FormGroup;
    public priorityItems: SelectListitem[] = [];
    public overlapItems: SelectListitem[] = [];
    public statusItems: SelectListitem[] = [];
    public visibleItems: SelectListitem[] = [];
    public visibleItemsPressOffice: SelectListitem[] = [];
    public RoadWorkCategories: SelectListitem[] = [];
    public notPlannedCategoryStatusItems: SelectListitem[] = [];
    public yearsItems: SelectListitem[] = [];
    public companies: Company[] = [];
    public neighborhoods: Neighborhood[] = [];
    public neighborhoodsItems: Neighborhood[] = [];
    public roadways: Roadway[] = [];
    public isNew: boolean = false;
    public showMap: boolean = false;
    public geoFeatureContainers: GeoFeatureContainer[] = [new GeoFeatureContainer()];
    public scheduled: RoadWorkCategories = RoadWorkCategories.Scheduled;
    public addressNumbers: AddressNumber[] = [];
    public attachmentsDisplayedColumns = ['name', 'isPublic', 'actions'];
    private id?: number = null;
    public attachmentsDataSource = new BehaviorSubject<AbstractControl[]>([]);
    public nearestRoadworks: RoadWorkMapItem[] = [];
    public roaditem: any = null;
    public onlyPlanned: boolean;
    public notScheduled: boolean;
    public onlyScheduled: boolean;
    public saveDisabled: boolean;
    public lastFilter: string;
    public readonly: boolean = false;

    @ViewChild("auto1", { static: false }) address: MatAutocomplete;
    @ViewChild("auto2", { static: false }) numberFrom: MatAutocomplete;
    @ViewChild("auto3", { static: false }) numberTo: MatAutocomplete;


    constructor(protected _roadWorkService: RoadWorkService, private _roadWaysService: RoadWaysService, private _neighborhoodsService: NeighborhoodsService, private _companiesService: CompaniesService,
        protected _dialog: MatDialog, protected _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private _matSnackBar: MatSnackBar, private _eventBusService: EventBusService) {
        this.priorityItems = RoadWorkUtils.getPrioritySelectlistItems();
        this.overlapItems = [{ id: true, label: "Si" }, { id: false, label: "No" }];
        this.statusItems = RoadWorkUtils.getStatusSelectlistItems(true);
        this.notPlannedCategoryStatusItems = RoadWorkUtils.getNotPlannedCategoryStatusSelectlistItems();
        this.visibleItems = RoadWorkUtils.getPublishStatus();
        this.visibleItemsPressOffice = RoadWorkUtils.getPublishStatusPressOffice();
        this.RoadWorkCategories = RoadWorkUtils.getCategorySelectlistItems();
    }

    /**
     * On init
     */
    public ngOnInit(): void {
        this._router.url == '/roadwork/planned' ? this.onlyPlanned = true : this.onlyPlanned = false;
        this._router.url == '/roadwork/noscheduled' ? this.notScheduled = true : this.notScheduled = false;
        this._router.url == '/roadwork/scheduled' ? this.onlyScheduled = true : this.onlyScheduled = false;
        let obs = of(new RoadWorkDetail());
        let obsAuditing = of(new AuditInfo());
        let id = this._activatedRoute.snapshot.queryParams["id"];
        this.lastFilter = (this._activatedRoute.snapshot.queryParams['criteria']);
        if (id) {
            this._eventBusService.showSpinner.emit(true);
            this.id = +id;
            obs = this._roadWorkService.getById(this.id);
            if (this.canManage) {
                obsAuditing = this._roadWorkService.getAuditInfo(this.id);
            }
            let readonlyQueryParams = this._activatedRoute.snapshot.queryParams["readonly"];
            if (readonlyQueryParams) {
                this.readonly = <boolean>readonlyQueryParams;
                this.saveDisabled = <boolean>readonlyQueryParams;
            }
        };

        let companyObs = this.canManage || this.canManageOffice ? this._companiesService.getCompanies() : this._companiesService.getMyCompany().pipe(map(result => [result]));
        forkJoin(companyObs, this._roadWaysService.getRoadways(), this._neighborhoodsService.getNeighborhoods(), this._roadWorkService.getYears(this.canManage || this.canManageOffice), obs, this.getAttachments(this.id), obsAuditing).subscribe(results => {
            this.companies = results[0];
            this.roadways = results[1];
            this.neighborhoods = results[2];
            this.yearsItems = results[3].map(m => new SelectListitem(m.year, m.year.toString()));
            this.geoFeatureContainers = [results[4].geoFeatureContainer];
            this.form = this.createForm(results[4], results[5], results[6]);
            this._eventBusService.showSpinner.emit(false);
            if (this.readonly) {
                this.form.disable();
            }
            this.setAutocompletes();
            if (this.id) {
                this.loadAddressNumber(this.form.controls["address"].value);
                this.getClosestRoadWorks();
            }
        });
        this.isNew = this.id == null;
    }

    protected getAttachments = (roadworkId?: number): Observable<RoadWorkAttachmentInfo[]> => {
        return of([]);
    }

    private createForm = (item: RoadWorkDetail = null, attachments: RoadWorkAttachmentInfo[] = [], auditInfo: AuditInfo): FormGroup => {
        let companyId = null;
        if (item.companyId || this.canManage || this.canManageOffice || this.companies.length == 0) {
            companyId = item.companyId;
        }
        else {
            companyId = this.companies[0].id;
        }
        let company = this.companies.find(f => f.id == companyId);

        let category = RoadWorkCategories.Scheduled;

        if (item != null) {
            category = item.category;
        }

        if (category == null) {
            if (this.canManage || this.canManageOffice/*&& !this.scheduled*/) {
                category = this.scheduled;
            }
            else {
                category = RoadWorkCategories.Scheduled;
            }
        }

        let ret = this._formBuilder.group({
            id: [item.id],
            companyId: [{ value: companyId, disabled: !this.canManage }, CommonValidators.required],
            companyNamePO: [{ value: company ? company.name : null, disabled: this.canManageOffice }],
            companyName: [{ name: company ? company.name : null, disabled: this.canManageOffice }],
            year: [{ value: item.year, disabled: this.canManageOffice }, CommonValidators.required],
            isOverlap: [{ value: item.isOverlap, disabled: this.canManageOffice }],
            priority: [{ value: item.priority, disabled: this.canManageOffice }],
            address: [{ value: item.address, disabled: this.canManageOffice }, CommonValidators.required],
            addressNumberFrom: [{ value: item.addressNumberFrom, disabled: this.canManageOffice }],
            addressPointFrom: [{ value: item.addressPointFrom, disabled: this.canManageOffice }],
            addressNumberTo: [{ value: item.addressNumberTo, disabled: this.canManageOffice }],
            addressPointTo: [{ value: item.addressPointTo, disabled: this.canManageOffice }],
            pinPoint: [{ value: item.pinPoint, disabled: this.canManageOffice }],
            neighborhoods: [{ value: item.neighborhoods, disabled: this.canManageOffice }],
            description: [{ value: item.description, disabled: this.canManageOffice }, CommonValidators.required],
            notScheduledStatus: [{ value: item.notScheduledStatus, disabled: this.canManageOffice }, this.scheduled ? [] : [CommonValidators.required]],
            visualizationNotes: [{ value: item.visualizationNotes, disabled: this.canManageOffice }],
            municipalityReferentName: [{ value: item.municipalityReferentName, disabled: this.canManageOffice }],
            companyReferentName: [{ value: item.companyReferentName, disabled: this.canManageOffice }],
            municipalityReferentPhoneNumber: [{ value: item.municipalityReferentPhoneNumber, disabled: this.canManageOffice }],
            companyReferentPhoneNumber: [{ value: item.companyReferentPhoneNumber, disabled: this.canManageOffice }],
            link: [{ value: item.link, disabled: this.canManageOffice }],
            effectiveStartDate: [{ value: item.effectiveStartDate, disabled: !this.canManage }],
            effectiveEndDate: [{ value: item.effectiveEndDate, disabled: !this.canManage }],
            estimatedStartDate: [{ value: item.estimatedStartDate, disabled: this.canManageOffice }],
            estimatedEndDate: [{ value: item.estimatedEndDate, disabled: this.canManageOffice }],
            status: [{ value: item.status, disabled: true }],
            notes: [{ value: item.notes, disabled: this.canManageOffice }],
            roadways: [{ value: item.roadways.map(m => m.id), disabled: this.canManageOffice }, ArrayValidators.minItems],
            publishStatus: [item.publishStatus, this.canManage || this.canManageOffice ? [CommonValidators.required] : []],
            category: [{ value: category, disabled: this.isNew || this.canManageOffice }],
            trafficChangesMeasure: [item.trafficChangesMeasure],
            descriptionForCitizens: [item.descriptionForCitizens],
            attachments: this._formBuilder.array([]),
            createdBy: [{ value: auditInfo ? auditInfo.createdBy : null, disabled: true }],
            createdAt: [{ value: auditInfo ? auditInfo.createdAt : null, disabled: true }],
            updatedBy: [{ value: auditInfo ? auditInfo.updatedBy : null, disabled: true }],
            lastUpdate: [{ value: auditInfo ? auditInfo.lastUpdate : null, disabled: true }]
        });

        let publishStatusDraft = PublishStatus.Draft
        if(this.isNew && this.canManage){
            ret.controls["publishStatus"].setValue(publishStatusDraft)
        }

        //Sottoscrivo il cambiamento agli attachment
        ret.controls.attachments.valueChanges.subscribe(value => {
            this.attachmentsDataSource.next((<FormArray>ret.controls.attachments).controls);
        })

        //Aggiungo gli attachments
        for (let i = 0; i < attachments.length; i++) {
            let attachmentFormGroup = this.attachmentToFormGroup(attachments[i]);
            (<FormArray>ret.controls.attachments).push(attachmentFormGroup);
        }

        return ret;
    }

    private attachmentToFormGroup = (attachment: RoadWorkAttachmentInfo): FormGroup => {
        return this._formBuilder.group({
            id: [attachment.id],
            isPublic: [attachment.isPublic],
            contentType: [attachment.contentType],
            name: [attachment.name],
        });
    }

    public geoFeatureContainerUpdate = (data: GeoFeatureContainer[]): void => {
        this.geoFeatureContainers = data;
    }

    public save(): void {
        if (this.form.valid) {
            this._eventBusService.showSpinner.emit(true);
            let data = <RoadWorkWrite>this.form.getRawValue();
            data.pinPoint = this.geoFeatureContainers[0].center;
            if (!data.pinPoint || isNaN(data.pinPoint.latitude) || isNaN(data.pinPoint.longitude)) {
                data.pinPoint = null;
            }
            data.geoFeatureContainer = JSON.stringify(this.geoFeatureContainers[0]);
            //Ompostare la sxection dai punti
            if (this.canManageOffice) {
                this._roadWorkService.updateByPressOffice(data).subscribe(s => {
                    this._matSnackBar.open('Lavoro stradale salvato', 'Chiudi', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                    this._router.navigateByUrl("/roadworks?criteria=" + this.lastFilter);
                    this._eventBusService.showSpinner.emit(false);
                })
            }
            else {
                this._roadWorkService.save(data).subscribe(s => {
                    this._matSnackBar.open('Lavoro stradale salvato', 'Chiudi', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                    this._router.navigateByUrl("/roadworks?criteria=" + this.lastFilter);
                    this._eventBusService.showSpinner.emit(false);
                })
            }

        }
    }

    public removeAttachment = (index: number): void => {
        let array = (<FormArray>this.form.controls.attachments);
        array.removeAt(index);
    }

    public addFile(files: FileList) {
        if (files && files.length) {
            this._roadWorkService.uploadAttachment(files[0]).subscribe(result => {
                let attachmentFormGroup = this.attachmentToFormGroup(result);
                (<FormArray>this.form.controls.attachments).push(attachmentFormGroup);
            });
        }
    }

    public changeTab = (data: MatTabChangeEvent): void => {
        this.showMap = data.index == (this.canManage ? 2 : 1);
    }

    public displayCompany = (company: Company): string => {
        return company ? company.name : null;
    }

    public companySelected = (event: MatAutocompleteSelectedEvent): void => {
        if (event && event.option && event.option.value) {
            this.form.controls.companyId.setValue(event.option.value.id);
        }
        else {
            this.form.controls.companyId.setValue(null);
        }
    }

    //Point part
    public filteredCompanies: Observable<Company[]>;
    public filteredStreets: Observable<string[]>;
    public filteredHouseNumbersFrom: Observable<string[]>;
    public filteredHouseNumbersTo: Observable<string[]>;
    private lastSelectedAddress: string = null;
    private setAutocompletes = (): void => {
        this.filteredStreets = this.form.controls['address'].valueChanges.pipe(
            mergeMap(value => {
                this.addressNumbers = [];
                this.neighborhoodsItems = [];
                this.form.controls["addressNumberFrom"].setValue(null);
                this.form.controls["addressNumberTo"].setValue(null);
                this.form.controls["neighborhoods"].setValue([]);
                return this._roadWorkService.searchAddress(value)
            })
        );
        this.filteredCompanies = this.form.controls['companyName'].valueChanges.pipe(
            map(value => {
                let valueToSearch = (value && value.name) ? value.name : value;
                let lowValue = (valueToSearch || "").toLowerCase();
                return this.companies.filter(f => f.name.toLowerCase().indexOf(lowValue) >= 0);
            })
        );

        this.filteredHouseNumbersFrom = this.form.controls['addressNumberFrom'].valueChanges.pipe(
            map(value => {
                let lowValue = (value || "").toLowerCase();
                return this.addressNumbers.filter(f => f.number.toLowerCase().indexOf(lowValue) >= 0).map(m => m.number);
            })
        );

        this.filteredHouseNumbersTo = this.form.controls['addressNumberTo'].valueChanges.pipe(
            map(value => {
                let lowValue = (value || "").toLowerCase();
                return this.addressNumbers.filter(f => f.number.toLowerCase().indexOf(lowValue) >= 0).map(m => m.number);
            })
        );
    }
    public addressSelected = (event: MatAutocompleteSelectedEvent): void => {
        if (event && event.option && event.option.value) {
            this.loadAddressNumber(event.option.value);
        }
        else {
            this.lastSelectedAddress = null;
        }
    }

    private loadAddressNumber = (address: string): void => {
        this.lastSelectedAddress = address;
        //Carico i numeri civici
        this._roadWorkService.getCivics(address).subscribe(results => {
            this.addressNumbers = results;
            let validNeighborhoodsItems = results.distinct(m => m.neighborhood);
            this.neighborhoodsItems = this.neighborhoods.filter(f => validNeighborhoodsItems.findIndex(f1 => f1 == f.id) >= 0);
        })
    }

    public numberSelected = (event: MatAutocompleteSelectedEvent, from: boolean): void => {
        let field = from ? "addressPointFrom" : "addressPointTo";
        if (event && event.option && event.option.value) {
            let point = this.addressNumbers.find(f => f.number == event.option.value);
            let coordinate = new Coordinate();
            coordinate.latitude = point.latitude;
            coordinate.longitude = point.longitude;
            this.form.controls[field].setValue(coordinate);
        }
        else {
            this.form.controls[field].setValue(null);
        }
        if (from) {
            this.getClosestRoadWorks();
        }
    }

    public get labeledPoints() {
        let ret: LabeledPoint[] = [];
        if (this.form) {
            let point = this.createLabeledPoint(true);
            if (point != null) {
                ret.push(point);
            }
            point = this.createLabeledPoint(false);
            if (point != null) {
                ret.push(point);
            }
        }
        return ret;
    }

    private createLabeledPoint = (from: boolean): LabeledPoint => {
        // let street = this.form.controls["address"].value
        // if (!street) {
        //     return null
        // }
        let number = this.form.controls[from ? "addressNumberFrom" : "addressNumberTo"].value;
        if (!number) {
            return null;
        }
        let point = <Coordinate>this.form.controls[from ? "addressPointFrom" : "addressPointTo"].value;
        if (point != null) {
            return {
                label: number,
                // label: street + ' ' + number,
                coordinates: {
                    altitude: 0,
                    latitude: point.latitude,
                    longitude: point.longitude
                }
            }
        }
    }

    public listLink = (): string => {
        return "/roadworks";
    }

    private getClosestRoadWorks = (): void => {
        if (this.form.controls.addressPointFrom.value && this.canManage) {
            let parameters = new ClosestCoordinate();
            parameters.latitude = this.form.controls.addressPointFrom.value.latitude;
            parameters.longitude = this.form.controls.addressPointFrom.value.longitude;
            parameters.year = this.form.controls.year.value;
            var closestRoadworks = this._roadWorkService.closestRoadworks(parameters).subscribe(results => {
                this.nearestRoadworks = [...results.filter(f => f.id != this.id)];
            });
        }
        else {
            this.nearestRoadworks = [];
        }
    }

    protected addNewCompany = (company: Company): void => {
        this.companies.push(company);
        this.form.controls.companyName.setValue(company);
        this.form.controls.companyId.setValue(company.id);
    }


    public selectedWork = (roadWorkId: any): void => {
        this._roadWorkService.getById(roadWorkId).pipe(flatMap(c => {
            this.roaditem = c;
            return this._companiesService.getCompanyById(c.companyId);

        })).subscribe(result => {
            let roadWorkItem = new RoadWorkMapItem();
            roadWorkItem.year = this.roaditem.year;
            roadWorkItem.address = this.roaditem.address;
            roadWorkItem.addressNumberFrom = this.roaditem.addressNumberFrom;
            roadWorkItem.addressNumberTo = this.roaditem.addressNumberTo;
            roadWorkItem.category = this.roaditem.category;
            roadWorkItem.companyName = result.name;
            roadWorkItem.description = this.roaditem.description;
            roadWorkItem.isOverlap = this.roaditem.isOverlap;
            roadWorkItem.link = this.roaditem.link;
            roadWorkItem.priority = this.roaditem.priority;
            roadWorkItem.status = this.roaditem.status;
            roadWorkItem.neighborhoods = this.roaditem.neighborhoods.map(e => e.name).join(", ");
            roadWorkItem.notScheduledStatus = this.roaditem.notScheduledStatus;
            roadWorkItem.roadways = this.roaditem.roadways.map(e => e.name).join(", ");
            roadWorkItem.trafficChangesMeasure = this.roaditem.trafficChangesMeasure;
            roadWorkItem.effectiveEndDate = this.roaditem.effectiveEndDate;
            roadWorkItem.effectiveStartDate = this.roaditem.effectiveStartDate;
            roadWorkItem.estimatedStartDate = this.roaditem.estimatedStartDate;
            roadWorkItem.estimatedEndDate = this.roaditem.estimatedEndDate;

            this._dialog.open(RoadWorksMapDetailComponent, {
                data: roadWorkItem,
                width: '60%',
            });
        });
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }

    public get canManageOffice() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_PressOffice);
    }

}
