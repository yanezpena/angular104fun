import { Injectable } from '@angular/core';

@Injectable()
export class StateOptionService {
	stateOptions: IState[] = [
		{
			id: 'draft',
			displayName: 'Draft',
			icon: 'note',
			color: 'draft-state-color',
		},
		{
			id: 'active',
			displayName: 'Active',
			icon: 'start',
			color: 'active-state-color',
		},
		{
			id: 'approved',
			displayName: 'Approved',
			icon: 'thumb_up',
			color: 'approved-state-color',
		},
		{
			id: 'done',
			displayName: 'Done',
			icon: 'check',
			color: 'done-state-color',
		},
		{
			id: 'reconciled',
			displayName: 'Reconciled',
			icon: 'attach_money',
			color: 'reconciled-state-color',
		},
	];

	constructor() {}

	public getStateOptions(): IState[] {
		return this.stateOptions;
	}

	public getDisplayName(id: string): string {
		return this.stateOptions.filter(x => x.id == id)[0].displayName;
	}

	public getIcon(id: string): string {
		return this.stateOptions.filter(x => x.id == id)[0].icon;
	}

	public getColor(id: string): string {
		return this.stateOptions.filter(x => x.id == id)[0].color;
	}

	public getState(id: string): IState {
		return this.stateOptions.filter(x => x.id == id)[0];
	}
}

export interface IState {
	id: string;
	displayName: string;
	icon: string;
	color: string;
}
