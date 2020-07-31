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
	style: number;
	title: string;
	message: string;
	information: string;
	button: number;
	allow_outside_click: boolean;
	iconType: string;

	constructor(
		public dialogRef: MatDialogRef<MessageDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data
	) {}

	ngOnInit() {
		this.title = this.data.title;
		this.message = this.data.message;
		this.information = this.data.information;
		this.button = this.data.button;
		this.dialogRef.disableClose = this.data.allow_outside_click || false;
		this.iconType = this.data.iconType || MessageIcon.Info;
	}

	onOk() {
		this.dialogRef.close({ result: MessageResult.Ok });
	}
	onCancel() {
		this.dialogRef.close({ result: MessageResult.Cancel });
	}
	onYes() {
		this.dialogRef.close({ result: MessageResult.Yes });
	}
	onNo() {
		this.dialogRef.close({ result: MessageResult.No });
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
		iconType?: MessageIcon,
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
				iconType: iconType || MessageIcon.Info,
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

export enum MessageResult {
	Ok = 'ok',
	Cancel = 'cancel',
	Yes = 'yes',
	No = 'no',
}

export enum MessageIcon {
	Info = 'info',
	Question = 'question',
	None = 'none',
	Warning = 'warning',
	Exclamation = 'exclamation',
}
