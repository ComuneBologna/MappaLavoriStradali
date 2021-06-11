import { Component, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'local-autocomplete',
  templateUrl: './local-autocomplete.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LocalAutocompleteComponent),
    multi: true,
  }]
})

export class LocalAutocompleteComponent extends InputComponent {
  @Input() items: string[]=[]
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
