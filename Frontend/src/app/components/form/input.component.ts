import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, ControlContainer, AbstractControl } from '@angular/forms';
import '../../common/extensions-methods/string.extensions' ;
import { ValidatorUtils } from 'app/common/validators/validator-utils';

export abstract class InputComponent<T = string, C=string> implements ControlValueAccessor, OnInit {
    ngOnInit(): void {
        if (this._controlContainer && this.formControlName) {
            this.control = this._controlContainer.control.get(this.formControlName);
        }
    }
    private _value: C = null;
    private _onChange = (_: any) => { };
    private _onTouched = () => { };
    public id: string = null;
    public disabled: boolean = false;
    public _label: string = null;
    private control: AbstractControl = null;
    @Input() formControlName: string = null;
    @Output() onValueChanged: EventEmitter<T> = new EventEmitter<T>();
    @Input() showLabel: boolean = true;
    @Input() 
    public get label(): string{
        return this._label;
    }
    public set label(value: string) {
        this._label = value;
    }

    @Input()
    public get value(): C {
        return this._value;
    }
    public set value(value: C) {
        this._value = value;
        let valueToEmit: T = null;
        if (value == null) {
            this._onChange(null);
        }
        else {
            valueToEmit = this.toExternalFormat(value)
            this._onChange(valueToEmit);
        }
        this.onValueChanged.next(valueToEmit);
        this._onTouched();
    }

    constructor(private _controlContainer: ControlContainer) {
        this.id = Date.now().toString() + Math.floor(Math.random() * 99).toString();
    }


    writeValue(value: T): void {
        if (value == null) {
            this._value = null;
        }
        else {
            this._value = this.toInternalFormat(value);
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public get valid(): boolean {
        return (!this.control || this.control.untouched || !this.control.invalid);
    }

    private get errorMessage(): string {
        if (!this.valid) {
            for (let prop in this.control.errors) {
                let message = ValidatorUtils.getValidationMessage(prop);
                message = message.replace("{fieldName}",this.label);
                return message.format(this.control.errors[prop]);
            }
        }
    }
    protected abstract toInternalFormat(value: T): C;
    protected abstract toExternalFormat(value: C): T;
}