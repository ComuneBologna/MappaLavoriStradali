import { Component, forwardRef, Optional, Host, SkipSelf, Input, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { InputComponent } from './input.component';

@Component({
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputFileComponent),
    multi: true,
  }]
})

export class InputFileComponent extends InputComponent<File, File> {

  @Input()
  public extensions: string[] = null;

  @Input()
  public validator: (file: File) => boolean = null;

  @ViewChild("fileInput", { static: false })
  private fileInput:ElementRef<HTMLInputElement> = null;

  public fileName: string = null;

  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  protected toInternalFormat(value: File): File {
    return value;
  }

  protected toExternalFormat(value: File): File {
    return value;
  }

  public get chainedExtensions(): string {
    return this.extensions ? this.extensions.join(', ') : null;
  }

  public handleFileInput(files: FileList) {
    if (files != null && files.item.length > 0 && (!this.validator || this.validator(files.item(0)))) {
      this.value = files.item(0);
      var fileParts = files.item(0).name.split('\\');
      this.fileName = fileParts[fileParts.length - 1];
    } else {
      this.value = null;
      this.fileName = null;
      this.fileInput.nativeElement.value = null;
    }
  }

}
