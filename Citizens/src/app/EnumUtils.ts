import { RoadWorkStatus, OverlapTypes, PriorityTypes } from './models/models';

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
                return "Non iniziato"
            default:
                return null
        }
    }
   
    public static getPriorityDescription = (priorityType?: PriorityTypes): string => {
        switch (priorityType) {
            case PriorityTypes.Equal:
                return "x"
            case PriorityTypes.Secondary:
                return "1"
            case PriorityTypes.Secondary:
                return "2"
            default:
                return null
        }
    }
}