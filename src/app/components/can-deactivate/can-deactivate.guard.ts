import { CanDeactivate } from '@angular/router';
import { CanDeactivateComponent } from './can-deactivate.component';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CanDeactivateGuard
	implements CanDeactivate<CanDeactivateComponent> {
	constructor(public translateService: TranslateService) {}
	canDeactivate(component: CanDeactivateComponent): boolean {
		if (!component.canDeactivate()) {
			if (confirm(this.translateService.instant('unsaved_changes'))) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	}
}
