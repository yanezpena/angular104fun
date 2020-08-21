import { Component, OnInit, Inject } from '@angular/core';
import {
	MatDialogRef,
	MatDialog,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
	selector: 'app-message-dialog',
	templateUrl: './message-dialog.component.html',
	styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent implements OnInit {
	title: string;
	message: string;
	information: string;
	button: number;
	allow_outside_click: boolean;
	iconType: string;

	constructor(
		public dialogRef: MatDialogRef<
			MessageDialogComponent,
			MessageBoxResult
		>,
		@Inject(MAT_DIALOG_DATA) public data
	) {}

	ngOnInit() {
		this.title = this.data.title;
		this.message = this.data.message;
		this.information = this.data.information;
		this.button = this.data.button;
		this.dialogRef.disableClose = this.data.allow_outside_click || false;
		this.iconType = this.data.iconType || MessageBoxIcon.Info;
	}

	onOk() {
		this.dialogRef.close(MessageBoxResult.Ok);
	}

	onCancel() {
		this.dialogRef.close(MessageBoxResult.Cancel);
	}

	onYes() {
		this.dialogRef.close(MessageBoxResult.Yes);
	}

	onNo() {
		this.dialogRef.close(MessageBoxResult.No);
	}
}

export class MessageBox {
	static show(
		dialog: MatDialog,
		message: string,
		title?: string,
		button?: MessageBoxButton,
		information?: string,
		allow_outside_click?: boolean,
		iconType?: MessageBoxIcon,
		width?: string
	) {
		let data = {
			data: {
				title: title || 'Alert',
				message: message,
				information: information,
				button: button || MessageBoxButton.Ok,
				allow_outside_click:
					button !== MessageBoxButton.Ok
						? true
						: allow_outside_click || false,
				iconType: iconType || MessageBoxIcon.Info,
			},
			id: 'message-box',
		};
		if (width !== '0') data['width'] = width;
		const dialogRef = dialog.open(MessageDialogComponent, data);
		return dialogRef.afterClosed();
	}
}

export enum MessageBoxButton {
	Ok = 0,
	OkCancel = 1,
	YesNo = 2,
}

export enum MessageBoxResult {
	Ok = 'ok',
	Cancel = 'cancel',
	Yes = 'yes',
	No = 'no',
}

export enum MessageBoxIcon {
	Info = 'info',
	Question = 'question',
	None = 'none',
	Warning = 'warning',
	Exclamation = 'exclamation',
}
