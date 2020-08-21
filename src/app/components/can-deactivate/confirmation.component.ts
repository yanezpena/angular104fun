import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-confirmation-dialog',
	template: `
		<div mat-dialog-title>You have unsaved changes</div>
		<div mat-dialog-content>
			What would you like to do?
		</div>
		<div mat-dialog-actions>
			<button mat-button (click)="onClickCancel()">STAY ON FORM</button>
			<button
				mat-raised-button
				class="confirm-button"
				color="warn"
				(click)="onClickConfirm()"
			>
				LEAVE WITHOUT SAVING
			</button>
		</div>
	`,
})
export class ConfirmationComponent {
	constructor(
		private readonly dialogRef: MatDialogRef<ConfirmationComponent, boolean>
	) {}

	onClickCancel() {
		this.dialogRef.close(false);
	}

	onClickConfirm() {
		this.dialogRef.close(true);
	}
}
