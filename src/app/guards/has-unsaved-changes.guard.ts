import { Injectable } from '@angular/core';
import {
	CanDeactivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CanDeactivateInterface } from '../components/can-deactivate/can-deactivate.interface';
import { ConfirmationDialogComponent } from '../components/can-deactivate/confirmation-dialog.component';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
	providedIn: 'root',
})
export class HasUnsavedChangesGuard
	implements CanDeactivate<CanDeactivateInterface> {
	// constructor
	constructor(readonly matDialog: MatDialog) {}

	// CanDeactivate implementation
	canDeactivate(
		component: CanDeactivateInterface,
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | boolean {
		return (
			component.canDeactivate() ||
			this.matDialog
				.open<ConfirmationDialogComponent, void, boolean>(
					ConfirmationDialogComponent,
					{
						disableClose: true,
					}
				)
				.afterClosed()
				.pipe(
					tap(confirmed => {
						if (!confirmed) history.pushState(null, '');
					})
				)
		);
	}
}
