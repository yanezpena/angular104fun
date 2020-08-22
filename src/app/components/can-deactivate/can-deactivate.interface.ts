import { Observable } from 'rxjs';

export interface CanDeactivateInterface {
	canDeactivate(): boolean | Observable<boolean>;
}
