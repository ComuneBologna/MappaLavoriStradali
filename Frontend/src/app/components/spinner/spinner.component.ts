import { Component, ViewEncapsulation } from '@angular/core';
import { EventBusService } from 'app/services/event-bus.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector     : 'spinner',
    templateUrl  : './spinner.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger(
          'inOutAnimation', 
          [
            transition(
              ':leave', 
              [
                style({ height: 300, opacity: 1 }),
                animate('1s ease-in', 
                        style({ height: 0, opacity: 0 }))
              ]
            )
          ]
        )
      ]
})
export class SpinnerComponent 
{
    public visible: boolean = false;

    constructor(private _eventBusService: EventBusService)
    {
        this._eventBusService.showSpinner.subscribe(result=>{
            this.visible = result;
        })
    }
}
