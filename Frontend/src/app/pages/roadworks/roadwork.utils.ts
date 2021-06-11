import { SelectListitem, PriorityTypes, OverlapTypes, RoadWorkStatus, NotPlannedCategoryStatus, CompanyTypes, VisibleTypes, RoadWorkCategories, PublishStatus, PermissionCodes } from 'app/models/models';
import { EnumUtils } from 'app/common/utils/enum.util';

export class RoadWorkUtils {
    public static getOverlapSelectlistItems = (): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(OverlapTypes.Yes, EnumUtils.getOverlapDescription(OverlapTypes.Yes)));
        ret.push(new SelectListitem(OverlapTypes.Not, EnumUtils.getOverlapDescription(OverlapTypes.Not)));
        return ret;
    }

    public static getNotPlannedCategoryStatusSelectlistItems = (): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(NotPlannedCategoryStatus.Proposed, EnumUtils.getNotPlannedCategoryStatusDescription(NotPlannedCategoryStatus.Proposed)));
        ret.push(new SelectListitem(NotPlannedCategoryStatus.Approved, EnumUtils.getNotPlannedCategoryStatusDescription(NotPlannedCategoryStatus.Approved)));
        ret.push(new SelectListitem(NotPlannedCategoryStatus.Authorized, EnumUtils.getNotPlannedCategoryStatusDescription(NotPlannedCategoryStatus.Authorized)));
        return ret;
    }

    public static getPrioritySelectlistItems = (): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(PriorityTypes.Equal, "X"));
        ret.push(new SelectListitem(PriorityTypes.Top, "1"));
        ret.push(new SelectListitem(PriorityTypes.Secondary, "2"));
        ret.push(new SelectListitem(PriorityTypes.Third, "3"));
        return ret;
    }

    public static getStatusSelectlistItems = (includeDeleted): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(RoadWorkStatus.NotStarted, EnumUtils.getStatusDescription(RoadWorkStatus.NotStarted)));
        ret.push(new SelectListitem(RoadWorkStatus.InProgress, EnumUtils.getStatusDescription(RoadWorkStatus.InProgress)));
        ret.push(new SelectListitem(RoadWorkStatus.ComingSoon, EnumUtils.getStatusDescription(RoadWorkStatus.ComingSoon)));
        ret.push(new SelectListitem(RoadWorkStatus.Completed, EnumUtils.getStatusDescription(RoadWorkStatus.Completed)));
        if (includeDeleted) {
            ret.push(new SelectListitem(RoadWorkStatus.Deleted, EnumUtils.getStatusDescription(RoadWorkStatus.Deleted)));
        }
        return ret;
    }

    public static getCompanySelectlistItems = (fixedType: CompanyTypes = null): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        if (!fixedType || fixedType == CompanyTypes.Company) {
            ret.push(new SelectListitem(CompanyTypes.Company, EnumUtils.getCompanyDescription(CompanyTypes.Company)));
        }
        if (!fixedType || fixedType == CompanyTypes.OperationalUnit) {
            ret.push(new SelectListitem(CompanyTypes.OperationalUnit, EnumUtils.getCompanyDescription(CompanyTypes.OperationalUnit)));
        }
        return ret;
    }

    public static getVisibleSelectlistItems = (fixedType: VisibleTypes = null): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(VisibleTypes.Yes, EnumUtils.getVisibleDescription(VisibleTypes.Yes)));
        ret.push(new SelectListitem(VisibleTypes.Not, EnumUtils.getVisibleDescription(VisibleTypes.Not)));
        return ret;
    }

    public static getCategorySelectlistItems = (fixedType: RoadWorkCategories = null): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(RoadWorkCategories.NotScheduled, EnumUtils.getCategoryDescription(RoadWorkCategories.NotScheduled)));
        ret.push(new SelectListitem(RoadWorkCategories.Scheduled, EnumUtils.getCategoryDescription(RoadWorkCategories.Scheduled)));
        ret.push(new SelectListitem(RoadWorkCategories.Planned, EnumUtils.getCategoryDescription(RoadWorkCategories.Planned)));

        return ret;
    }


    public static getPermissionCodesSelectlistItems = (): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(PermissionCodes.RoadWorks_Admin, EnumUtils.getPermissionCodesDescription(PermissionCodes.RoadWorks_Admin)));
        ret.push(new SelectListitem(PermissionCodes.RoadWorks_Operator, EnumUtils.getPermissionCodesDescription(PermissionCodes.RoadWorks_Operator)));
        ret.push(new SelectListitem(PermissionCodes.RoadWorks_PressOffice, EnumUtils.getPermissionCodesDescription(PermissionCodes.RoadWorks_PressOffice)));

        return ret;
    }

    public static getPublishStatus = (fixedType: PublishStatus = null): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(PublishStatus.Approved, EnumUtils.getPublishStatusDescription(PublishStatus.Approved)));
        ret.push(new SelectListitem(PublishStatus.Draft, EnumUtils.getPublishStatusDescription(PublishStatus.Draft)));
        ret.push(new SelectListitem(PublishStatus.WaitingToApprove, EnumUtils.getPublishStatusDescription(PublishStatus.WaitingToApprove)));

        return ret;
    }

    public static getPublishStatusPressOffice = (fixedType: PublishStatus = null): SelectListitem[] => {
        let ret: SelectListitem[] = [];
        ret.push(new SelectListitem(PublishStatus.Approved, EnumUtils.getPublishStatusDescription(PublishStatus.Approved)));
        ret.push(new SelectListitem(PublishStatus.WaitingToApprove, EnumUtils.getPublishStatusDescription(PublishStatus.WaitingToApprove)));

        return ret;
    }

}