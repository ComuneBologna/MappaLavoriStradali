import { Component, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
    selector: 'input-check-box',
    templateUrl: './input-check-box.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputCheckBoxComponent),
        multi: true,
    }]
})
export class InputCheckBoxComponent extends InputComponent<boolean,boolean> {
    @Input()
    public labelPosition:LabelPosition = 'after';

    @Input()
    public falseLabel: string = null;

    public get currentLabel():string{
        if(this.value || !this.falseLabel){
            return this.label;
        }
        return this.falseLabel;
    }

    constructor(controlContainer: ControlContainer) {
        super(controlContainer);
    }

    protected toInternalFormat(value: boolean): boolean {
        return value;
    }

    protected toExternalFormat(value: boolean): boolean {
        return value;
    }
}


declare type LabelPosition = 'before' | 'after';