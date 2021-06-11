import { Component, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'input-decimal',
  templateUrl: './input-decimal.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDecimalComponent),
    multi: true,
  }]
})

export class InputDecimalComponent extends InputComponent<number> {  
    constructor(controlContainer: ControlContainer) {
        super(controlContainer);
    }

    protected toInternalFormat(value: number): string {        
        return value.toString();
    }

    protected toExternalFormat(value: string): number {        
        if(value.split('.').length>2){
            return NaN;
        }
        return value ? parseFloat(value.trim()):null;
    }

}
