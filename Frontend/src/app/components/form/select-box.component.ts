import { Component, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'select-box',
  templateUrl: './select-box.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectBoxComponent),
    multi: true,
  }]
})

export class SelectBoxComponent extends InputComponent<any, any> {
  @Input() itemKey: string = "id";
  @Input() itemLabel: string = "label";
  @Input() nullLabel: string = null;
  @Input() items: any[] = [];
  @Input() multiple: boolean = false;
  constructor(controlContainer: ControlContainer) {
    super(controlContainer);    
  }

  protected toInternalFormat(value: any): any {
    return value;
  }

  protected toExternalFormat(value: any): any {
    if (value === "" || value === null) {
      return this.multiple ? [] : null;
    }
    return value;
  }

}
