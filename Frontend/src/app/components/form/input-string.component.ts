import { Component, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'input-string',
  templateUrl: './input-string.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputStringComponent),
    multi: true,
  }]
})

export class InputStringComponent extends InputComponent {
  @Input() rows: number = 1;
  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  protected toInternalFormat(value: string): string {
    return value;
  }

  protected toExternalFormat(value: string): string {
    return value;
  }

}
