import { Injectable } from '@angular/core';
import {
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
	MatSnackBar,
} from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {
	horizontalPosition: MatSnackBarHorizontalPosition = 'right';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	duration: number = 1500;

	constructor(private _snackBar: MatSnackBar) {}

	openSnackBar(message: string) {
		this._snackBar.open(message, '', {
			duration: this.duration,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass:['success-notification'],
		});
	}

	// span = `<span class="tim-icons icon-bell-55" [data-notify]="icon"></span>`;
	// classes = {
	// 	toastClass: `alert alert-info alert-with-icon`,
	// 	closeButton: true,
	// 	enableHtml: true,
	// 	positionClass: "toast-bottom-center"
	// };

	public success(message: string, title: string) {
		// let text = this.span + ` ${message}.`;
		// this.classes.toastClass = "alert alert-success alert-with-icon";
		this.openSnackBar(message);
	}

	// public info(message: string, title: string) {
	// 	let text = this.span + ` ${message}.`;
	// 	this.classes.toastClass = "alert alert-info alert-with-icon";
	// 	this.toastr.info(text, title, this.classes);
	// }

	// public warning(message: string, title: string) {
	// 	let text = this.span + ` ${message}.`;
	// 	this.classes.toastClass = "alert alert-warning alert-with-icon";
	// 	this.toastr.warning(text, title, this.classes);
	// }

	public error(message: string, title: string) {
		// 	let text = this.span + ` ${message}.`;
		// 	this.classes.toastClass = "alert alert-error alert-with-icon";
		// 	this.toastr.error(text, title, this.classes);
		this.openSnackBar(message);
	}
}
