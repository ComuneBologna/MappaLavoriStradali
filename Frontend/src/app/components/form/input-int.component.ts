import { Component, forwardRef, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'input-int',
  templateUrl: './input-int.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputIntComponent),
    multi: true,
  }]
})

export class InputIntComponent extends InputComponent<number> {  
    constructor(controlContainer: ControlContainer,) {
        super(controlContainer);
    }

    protected toInternalFormat(value: number): string {        
        return value.toString();
    }

    protected toExternalFormat(value: string): number {        
        return value ? parseInt(value.trim()):null;
    }

}
