import { ISelectOption } from "../models/ISelectOption";
import { Injectable } from "@angular/core";
import {
	faStickyNote,
	faFolderOpen,
	faThumbsUp,
	faCheckCircle,
	faMoneyBill,
	IconDefinition
} from "@fortawesome/free-solid-svg-icons";

@Injectable()
export class StateOptionService {
	stateOptions = [
		{
			id: "draft",
			displayName: "Draft",
			icon: faStickyNote,
			color: "draft-state-color"
		},
		{
			id: "active",
			displayName: "Active",
			icon: faFolderOpen,
			color: "active-state-color"
		},
		{
			id: "approved",
			displayName: "Approved",
			icon: faThumbsUp,
			color: "approved-state-color"
		},
		{
			id: "done",
			displayName: "Done",
			icon: faCheckCircle,
			color: "done-state-color"
		},
		{
			id: "reconciled",
			displayName: "Reconciled",
			icon: faMoneyBill,
			color: "reconciled-state-color"
		}
	];

	constructor() {}

	public getStateOptions(): ISelectOption[] {
		return this.stateOptions;
	}

	public getDisplayName(id: string): string {
		return this.stateOptions.filter(x => x.id == id)[0].displayName;
	}

	public getIcon(id: string): IconDefinition {
		return this.stateOptions.filter(x => x.id == id)[0].icon;
	}

	public getColor(id: string): string {
		return this.stateOptions.filter(x => x.id == id)[0].color;
	}
}
