import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-confirmation-dialog',
	templateUrl: './confirmation-dialog.component.html',
	styleUrls: ['./confirmation-dialog.component.scss'],
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
