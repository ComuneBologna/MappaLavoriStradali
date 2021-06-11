import { GeoFeatureContainer } from './GeoFeature';


export class Authority {
    public authorityId: number = 0;
    public name: string = null;
    public imageUrl: string = null;
    public logoUrl: string = null;
    public latitude: number = 0;
    public longitude: number = 0;
}

export class User {
    public name: string = null;
    public roles: string[] = [];
    public id: string = null;
    public get isBackofficeUser() {
        return this.roles.indexOf("Backoffice") >= 0;
    }
    public currentAuthority: Authority = null;

}


export class Settings {
    public static user: User = new User();
    public static authorities: Authority[];
}

export class Coordinate {
    public latitude: number = 0;
    public longitude: number = 0;
}

export class Roadway {
    public id: number = 0;
    public name: string = null;
}

export class Neighborhood {
    public id: number = 0;
    public name: string = null;
}

export class Period {
    public id: number = 0;
    public year: number = 0;
    public submissionStartDate: string = null;
    public submissionEndDate: string = null;
}

export class Company {
    public id: number = 0;
    public name: string = null;
    public isOperationalUnit: boolean = false;
}

export class NewCompany {
    public name: string = null;
    public user: NewCompanyUser = new NewCompanyUser();
    public isOperationalUnit: boolean = false;
}

export class NewCompanyUser {
    public email: string = null;
    public firstName: string = null;
    public surname: string = null;
    public fiscalCode: string = null;
}

export class RoadWorkBase {
    public year: string = null;
    public isOverlap?: boolean = false;
    public priority?: PriorityTypes = null;
    public address: string = null;
    public addressNumberFrom: string = null;
    public addressNumberTo: string = null;
    public description: string = null;
    public visualizationNotes: string = null;
    public descriptionForCitizens: string = null;
    public effectiveStartDate?: string = null;
    public effectiveEndDate?: string = null;
    public estimatedStartDate?: string = null;
    public estimatedEndDate?: string = null;
    public companyId: number = null;
    public notes: string = null;
    public isVisible: boolean = false;
    public notPlannedStatus?: NotPlannedCategoryStatus = null;
    public category: RoadWorkCategories;
    public municipalityReferentName: string = null;
    public companyReferentName: string = null;
    public municipalityReferentPhoneNumber: string = null;
    public companyReferentPhoneNumber: string = null;
    public link: string = null;
    public trafficChangesMeasure: string = null;
    public companyIsOperationalUnit: boolean = false;
    public get referredLink(): string {
        if (this.link) {
            if (this.link.indexOf("http://") < 0 && this.link.indexOf("https://") < 0)
                return "http://" + this.link;
        }

        return this.link;
    }
    public get extendedAddressName() {
        if (this.addressNumberFrom && this.addressNumberTo)
            return this.address + " dal civico " + this.addressNumberFrom + " al civico " + this.addressNumberTo;
        else if (!this.addressNumberFrom && this.addressNumberTo)
            return this.address + " dal civico 1 al civico " + this.addressNumberTo;
        else if (this.addressNumberFrom && !this.addressNumberTo)
            return this.address + " dal civico " + this.addressNumberFrom;
        else
            return this.address;
    }
}

export class RoadWorkItem extends RoadWorkBase {
    public id: number = 0;
    public roadways: string[] = [];
    public companyName: string = null;
    public neighborhoods: string[] = [];
    public status?: RoadWorkStatus = null;
}

export class RoadWorkWrite extends RoadWorkBase {
    public id: number = 0;
    public addressPoint: Coordinate[] = [];
    public roadways: Roadway[] = [];
    public section: Coordinate[] = [];
    public neighborhoods: number[] = [];
    public geoFeatureContainer: string = null;
    public addressPointFrom: Coordinate = null;
    public addressPointTo: Coordinate = null;
    public pinPoint: Coordinate = null;
}


export class RoadWorkMapItem extends RoadWorkBase {
    public id: number = 0;
    public roadways: string[] = [];
    public companyName: string = null;
    public neighborhoods: string[] = [];
    public status?: RoadWorkStatus = null;
    public geoFeatureContainer: GeoFeatureContainer = new GeoFeatureContainer();
}

export class RoadWorkDetail extends RoadWorkBase {
    public id: number = 0;
    public addressPoint: Coordinate[] = [];
    public companyName: string = null;
    public roadways: Roadway[] = [];
    public section: Coordinate[] = [];
    public neighborhoods: Neighborhood[] = [];
    public geoFeatureContainer: GeoFeatureContainer = new GeoFeatureContainer();
    public addressPointFrom: Coordinate = null;
    public addressPointTo: Coordinate = null;
    public pinPoint: Coordinate = null;
    public status?: RoadWorkStatus = null;
}

export class RoadWorkFilters {
    public id?: number = null;
    public company?: number = null;
    public year?: number = null;
    public neighborhood: string = null;
    public roadwayName: string = null;
    public description: string = null;
    public status?: RoadWorkStatus = null;
    public priorities?: PriorityTypes = null;
    public isOverlap?: boolean = null;
    public addressName: string = null;
    public effectiveStartDateFrom: string = null;
    public effectiveStartDateTo: string = null;
    public effectiveEndDateFrom: string = null;
    public effectiveEndDateTo: string = null;
    public category?: RoadWorkCategories = null;
    public companyType?: CompanyTypes = null;
    public visibleType?: VisibleTypes = null;
}

export class SelectListitem {
    constructor(public id: any = null, public label: string = null) {

    }
}

export class RoadWorkAttachmentBase {
    public id: number = 0;
    public isPublic: boolean = false;
}

export class RoadWorkAttachmentInfo extends RoadWorkAttachmentBase {
    public name: string = null;
    public contentType: string = null;
}
export class Years {
    public year: number;
    public isDefault: boolean = false;
}

export enum RoadWorkStatus {
    Completed = "Completed",
    Deleted = "Deleted",
    InProgress = "InProgress",
    NotStarted = "NotStarted",
    ComingSoon = "ComingSoon"
}

export enum CompanyTypes {
    Company = "Company",
    OperationalUnit = "OperationalUnit"
}

export enum VisibleTypes {
    Yes = "Published",
    Not = "NotPublished"
}

export enum RoadWorkCategories {
    Planned = "Planned",
    NotPlanned = "NotPlanned"
}

export enum NotPlannedCategoryStatus {
    Proposed = "Proposed",
    Approved = "Approved",
    Authorized = "Authorized"
}
export enum OverlapTypes {
    Yes = "Yes",
    Not = "Not"
}
export enum PriorityTypes {
    Top = "Top",
    Secondary = "Secondary",
    Third = "Third",
    Equal = "Equal"
}

export class SearchResult<T>{
    public result: T[] = [];
    public totalCount: number = 0;
}

export class SearchCriteria {
    public pagingCriteria: PagingCriteria = new PagingCriteria();
    public orderCriteria: any[] = [];
}

export class PagingCriteria {
    public itemsPerPage: number = 10;
    public pageNumber: number = 1;
}

export class AddressNumber {
    number: string;
    latitude: number;
    longitude: number;
    neighborhood: number;
}
export class AuditInfo {
    public createdBy: string = null;
    public createdAt: string = null;
    public updatedBy: string = null;
    public lastUpdate: string = null;

}
