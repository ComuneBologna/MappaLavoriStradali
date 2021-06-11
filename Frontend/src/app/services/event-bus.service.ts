import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class EventBusService {
    public showSpinner: EventEmitter<boolean> = new EventEmitter<boolean>();
}

