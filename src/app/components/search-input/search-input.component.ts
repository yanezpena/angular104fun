import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
	// form and control
	curForm: FormGroup;
	// change event
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		// set form defaults
		this.setFormDefaults();
		// catch event changes
		this.curForm.controls.searchInput.valueChanges.subscribe(value => {
			if (typeof value === 'string') {
				this.searchChange.emit(value);
			}
		});
	}

	setFormDefaults() {
		this.curForm = this.fb.group({
			searchInput: [''],
		});
	}
}
