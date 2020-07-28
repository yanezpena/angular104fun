import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { languages } from '../../data/languages';
import { Language } from '../../models/language';

@Component({
	selector: 'app-select-language',
	templateUrl: './select-language.component.html',
	styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent implements OnInit {
	// input values
	@Input() defaultValue: string = 'en';

	// output events
	@Output() languageChange: EventEmitter<string> = new EventEmitter<string>();

	languages: Language[] = languages;

	constructor() {}

	value: string;

	ngOnInit(): void {
		// set default value
		this.value = this.defaultValue;
	}

	onChange(event) {
		this.languageChange.emit(event.value);
	}
}
