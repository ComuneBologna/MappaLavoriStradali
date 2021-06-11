import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputCheckBoxComponent } from './form/input-check-box.component';
import { InputDateComponent } from './form/input-date.component';
import { InputDecimalComponent } from './form/input-decimal.component';
import { InputIntComponent } from './form/input-int.component';
import { InputStringComponent } from './form/input-string.component';
import { SelectBoxComponent } from './form/select-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputPasswordComponent } from './form/input-password.component';
import { InputFileComponent } from './form/input-file.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LocalAutocompleteComponent } from './form/local-autocomplete.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { AddDialogComponent } from './map-editor/add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from './map-editor/confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from './map-editor/rename-dialog/rename-dialog.component';
import { MatIconModule } from '@angular/material';
import { FormErrorsComponent } from './form/form-errors.component';
import { AuthorityChoicerComponent } from '../layout/components/navbar/vertical/style-1/authority-choicer.component';

@NgModule({
    imports: [
        RouterModule,
        BrowserModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        FormErrorsComponent,
        InputCheckBoxComponent,
        InputDateComponent,
        InputDecimalComponent,
        InputIntComponent,
        InputPasswordComponent,
        InputStringComponent,
        InputFileComponent,
        LocalAutocompleteComponent,
        SelectBoxComponent,
        DeleteDialogComponent,
        MapEditorComponent,
        AddDialogComponent,
        ConfirmDialogComponent,
        RenameDialogComponent
    ],
    exports: [
        FormErrorsComponent,
        InputCheckBoxComponent,
        InputDateComponent,
        InputDecimalComponent,
        InputIntComponent,
        InputPasswordComponent,
        InputStringComponent,
        InputFileComponent,
        LocalAutocompleteComponent,
        SelectBoxComponent,
        MapEditorComponent
    ],
    entryComponents: [
        DeleteDialogComponent,
        AddDialogComponent,
        ConfirmDialogComponent,
        RenameDialogComponent,
        FormErrorsComponent
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'it' },
    ]
})
export class ComponentsModule { }
