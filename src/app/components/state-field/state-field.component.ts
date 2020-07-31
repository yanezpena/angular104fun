import { Component, OnInit, Input } from '@angular/core';
import { StateOptionService, IState } from '../../shared/state-option.service';

@Component({
	selector: 'app-state-field',
	templateUrl: './state-field.component.html',
	styleUrls: ['./state-field.component.scss'],
})
export class StateFieldComponent implements OnInit {
	// input state id
	@Input()
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
		this.state = this.stateOptionService.getState(id);
	}
	public _id = undefined;

	state: IState;

	constructor(private stateOptionService: StateOptionService) {}

	ngOnInit() {}
}
