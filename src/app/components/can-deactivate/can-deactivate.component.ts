import { HostListener, Injectable } from '@angular/core';

@Injectable()
export abstract class CanDeactivateComponent {
	abstract canDeactivate(): boolean;

	@HostListener('window:beforeunload', ['$event'])
	unloadNotification($event: any) {
		if (!this.canDeactivate()) {
			$event.returnValue = true;
		}
	}
}
