import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationService {
	// toastr config
	toastrConfig: Partial<IndividualConfig> = {
		timeOut: 1500,
		progressBar: true,
		progressAnimation: 'decreasing',
		closeButton: true,
	};

	constructor(
		private toastr: ToastrService,
		private translationService: TranslateService
	) {}

	public success(message: string, title: string) {
		var tr = this.translation(message, title);
		this.toastr.success(tr.message, tr.title, this.toastrConfig);
	}

	public info(message: string, title: string) {
		var tr = this.translation(message, title);
		this.toastr.info(tr.message, tr.title, this.toastrConfig);
	}

	public warning(message: string, title: string) {
		var tr = this.translation(message, title);
		this.toastr.warning(tr.message, tr.title, this.toastrConfig);
	}

	public error(message: string, title: string) {
		var tr = this.translation(message, title);
		this.toastr.error(tr.message, tr.title, this.toastrConfig);
	}

	private translation(message: string, title: string) {
		return {
			message: this.translationService.instant(message),
			title: this.translationService.instant(title),
		};
	}
}
