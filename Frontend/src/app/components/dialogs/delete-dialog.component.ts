import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'delete-dialog',
    templateUrl: './delete-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }

    public close = (): void => {
        this.dialogRef.close();
    }
}