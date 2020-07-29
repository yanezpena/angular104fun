import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class NotificationService {
	constructor(private toastr: ToastrService) {}

	// public messageBox(type: string, message: string, title: string) {
	// 	let text = `<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> ${message}.`;
	// 	let classes = {
	// 		toastClass: `alert alert-${type} alert-with-icon`,
	// 		closeButton: true,
	// 		enableHtml: true,
	// 		positionClass: "toast-bottom-center"
	// 	};
	// 	switch (type) {
	// 		case "success": {
	// 			this.toastr.success(text, title, classes);
	// 			break;
	// 		}
	// 		case "info": {
	// 			this.toastr.info(text, title, classes);
	// 			break;
	// 		}
	// 		case "warning": {
	// 			this.toastr.warning(text, title, classes);
	// 			break;
	// 		}
	// 		case "error": {
	// 			this.toastr.error(text, title, classes);
	// 			break;
	// 		}
	// 		default: {
	// 			this.toastr.success(text, title, classes);
	// 			break;
	// 		}
	// 	}
	// }

	span = `<span class="tim-icons icon-bell-55" [data-notify]="icon"></span>`;
	classes = {
		toastClass: `alert alert-info alert-with-icon`,
		closeButton: true,
		enableHtml: true,
		positionClass: "toast-bottom-center"
	};

	public success(message: string, title: string) {
		let text = this.span + ` ${message}.`;
		this.classes.toastClass = "alert alert-success alert-with-icon";
		this.toastr.success(text, title, this.classes);
	}

	public info(message: string, title: string) {
		let text = this.span + ` ${message}.`;
		this.classes.toastClass = "alert alert-info alert-with-icon";
		this.toastr.info(text, title, this.classes);
	}

	public warning(message: string, title: string) {
		let text = this.span + ` ${message}.`;
		this.classes.toastClass = "alert alert-warning alert-with-icon";
		this.toastr.warning(text, title, this.classes);
	}

	public error(message: string, title: string) {
		let text = this.span + ` ${message}.`;
		this.classes.toastClass = "alert alert-error alert-with-icon";
		this.toastr.error(text, title, this.classes);
	}
}
