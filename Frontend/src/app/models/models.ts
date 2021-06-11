import { GeoFeatureContainer } from './GeoFeature';

export class User {
    public name: string = null;
    public permissions: PermissionCodes[] = [];
    public id: string = null;
    public currentAuthority: Authority = null;
    public hasPermission = (permission: PermissionCodes): boolean => {
        return this.permissions.findIndex(f => f == permission) >= 0;
    }
}

export class Authority {
    public authorityId: number = null;
    public name: string = null;
    public imageUrl: string = null;
    public logoUrl: string = null;
    public latitude: string;
    public longitude: string;
}

export class Permission {
    public code: PermissionCodes = null;
    public description: string = null;
}

export enum PermissionCodes {
    RoadWorks_Operator = "RoadWorks_Operator",
    RoadWorks_PressOffice = "RoadWorks_PressOffice",
    RoadWorks_Admin = "RoadWorks_Admin",
    Tenant_Admin = "Tenant_Admin"
}

export class Settings {
    public static user: User = new User();
    public static authorities: Authority[] = [];
}

export class Coordinate {
    public latitude: number = 0;
    public longitude: number = 0;
}

export class ClosestCoordinate extends Coordinate {
    public year: number = null;
}

export class Roadway {
    public id: number = 0;
    public name: string = null;
    public email: string = null;
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
    public id: number = null;
    public name: string = null;
    public isOperationalUnit: boolean = false;
}

export class NewCompanyUser {
    public email: string = null;
    public firstname: string = null;
    public surname: string = null;
    public fiscalCode: string = null;
    public phoneNumber: string = null;
}

export class NewCompanyUserInfo {
    public id: string = null;
    public name: string = null;
    public email: string = null;
    public surname: string = null;
    public fiscalCode: string = null;
    public phoneNumber: string = null;
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
    public effectiveStartDate?: string = null;
    public effectiveEndDate?: string = null;
    public estimatedStartDate?: string = null;
    public estimatedEndDate?: string = null;
    public companyId: number = null;
    public notes: string = null;
    public publishStatus: PublishStatus = null;
    public notScheduledStatus?: NotPlannedCategoryStatus = null;
    public category: RoadWorkCategories;
    public municipalityReferentName: string = null;
    public companyReferentName: string = null;
    public municipalityReferentPhoneNumber: string = null;
    public companyReferentPhoneNumber: string = null;
    public link: string = null;
    public trafficChangesMeasure: string = null;
    public descriptionForCitizens: string = null;

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
    public neighborhoods: string[] = [];
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
    public roadways: Roadway[] = [];
    public section: Coordinate[] = [];
    public neighborhoods: string[] = [];
    public geoFeatureContainer: GeoFeatureContainer = new GeoFeatureContainer();
    public addressPointFrom: Coordinate = null;
    public addressPointTo: Coordinate = null;
    public pinPoint: Coordinate = null;
    public status?: RoadWorkStatus = null;
}

export class RoadWorkFilters {
    public id?: number = null;
    public companyId?: number = null;
    public yearFrom?: number = null;
    public yearTo?: number = null;
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
    public categories: RoadWorkCategories[] = [];
    public companyType?: CompanyTypes = null;
    public visibleType?: VisibleTypes = null;
    public publishStatus?: PublishStatus = null;
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
    Scheduled = "Scheduled",
    NotScheduled = "NotScheduled",
    Planned = "Planned"
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

export enum PublishStatus {
    Draft = "Draft",
    WaitingToApprove = "WaitingToApprove",
    Approved = "Approved",
}

export class SearchResult<T>{
    public items: T[] = [];
    public totalCount: number = 0;
}

export class SearchCriteria {
    public itemsPerPage: number = 10;
    public pageNumber: number = 1;
    public keySelector: string = null;
    public ascending: boolean = true;
}


export class AddressNumber {
    number: string;
    latitude: number;
    longitude: number;
    neighborhood: number;
}

export class AddressNumberAPI {
    id: number;
    number: string;
    mapPoint: Coordinate;
    neighborhood: Neighborhood;
}

export class AuditInfo {
    public createdBy: string = null;
    public createdAt: string = null;
    public updatedBy: string = null;
    public lastUpdate: string = null;

}
export class Log {
    public id: number;
    public companyName: string;
    public migrationDate: string;
    public fileName: string;
}

export class LogFilter {
    public id: number = null;
    public companyId: number = null;
    public migrationDate: string = null;
}

export class BaseBackofficeUser {
    public lastName: string = null;
    public firstName: string = null;
    public email: string = null;
    public fiscalCode: string = null;
}
export class BackofficeUserItem extends BaseBackofficeUser {
    public id: string = null;
    public companyId?: number = null;
    public companyName: string = null;
}

export class BackofficeUser extends BackofficeUserItem {
    public roleCode: PermissionCodes;
}

export class BackofficeUserWrite {
    public id: string = null;
    public lastName: string = null;
    public firstName: string = null;
    public email: string = null;
    public roleCode: string = null;
    public companyId?: number = null;
}

export class Role {
    public id: number = null;
    public code: string = null;
    public description: string = null;
}