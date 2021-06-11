import { RoadWorkStatus, OverlapTypes, PriorityTypes, NotPlannedCategoryStatus, CompanyTypes, VisibleTypes, RoadWorkCategories, PublishStatus, PermissionCodes } from 'app/models/models';

export class EnumUtils {
    public static getStatusDescription = (status?: RoadWorkStatus): string => {
        switch (status) {
            case RoadWorkStatus.Completed:
                return "Completato"
            case RoadWorkStatus.Deleted:
                return "Eliminato"
            case RoadWorkStatus.InProgress:
                return "In corso"
            case RoadWorkStatus.NotStarted:
                return "In programma"
            case RoadWorkStatus.ComingSoon:
                return "In fase di attivazione"
            default:
                return "Non definito"
        }
    }
    public static getCompanyDescription = (company?: CompanyTypes): string => {
        switch (company) {
            case CompanyTypes.Company:
                return "Ditte"
            case CompanyTypes.OperationalUnit:
                return "Unità Operative"
            default:
                return null
        }
    }
    public static getVisibleDescription = (visibleType?: VisibleTypes): string => {
        switch (visibleType) {
            case VisibleTypes.Yes:
                return "Si"
            case VisibleTypes.Not:
                return "No"
            default:
                return null
        }
    }
    public static getNotPlannedCategoryStatusDescription = (status?: NotPlannedCategoryStatus): string => {
        switch (status) {
            case NotPlannedCategoryStatus.Proposed:
                return "Proposto"
            case NotPlannedCategoryStatus.Approved:
                return "Approvato"
            case NotPlannedCategoryStatus.Authorized:
                return "Autorizzato"
            default:
                return null
        }
    }
    public static getOverlapDescription = (overlapType?: OverlapTypes): string => {
        switch (overlapType) {
            case OverlapTypes.Yes:
                return "Si"
            case OverlapTypes.Not:
                return "No"
            default:
                return null
        }
    }
    public static getPriorityDescription = (priorityType?: PriorityTypes): string => {
        switch (priorityType) {
            case PriorityTypes.Equal:
                return "x"
            case PriorityTypes.Top:
                return "1"
            case PriorityTypes.Secondary:
                return "2"
            case PriorityTypes.Third:
                return "3"
            default:
                return null
        }
    }
    public static getCategoryDescription = (category?: RoadWorkCategories): string => {
        switch (category) {
            case RoadWorkCategories.NotScheduled:
                return "Non programmato"
            case RoadWorkCategories.Scheduled:
                return "Programmato"
            case RoadWorkCategories.Planned:
                return "Pianificato"
            default:
                return null
        }
    }
    public static getPermissionCodesDescription = (permission?: PermissionCodes): string => {
        switch (permission) {
            case PermissionCodes.RoadWorks_Admin:
                return "Amministratore"
            case PermissionCodes.RoadWorks_Operator:
                return "Operatore"
            case PermissionCodes.RoadWorks_PressOffice:
                return "Ufficio stampa"
            default:
                return null
        }
    }

    public static getPublishStatusDescription = (status?: PublishStatus): string => {
        switch (status) {
            case PublishStatus.Approved:
                return "Approvato"
            case PublishStatus.Draft:
                return "Bozza"
            case PublishStatus.WaitingToApprove:
                return "In attesa di approvazione"
            default:
                return null
        }
    }
}