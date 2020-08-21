import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map, startWith, delay, switchMap, filter, tap } from 'rxjs/operators';

import { pokemons, swCharacters } from './data/data';
import {
	MatAutocomplete,
	MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSidenav } from '@angular/material/sidenav';

import { languages } from './data/languages';
import { Language } from './models/language';

import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { CanDeactivateState } from './components/can-deactivate/can-deactivate.guard';

export interface IItem {
	id?: number;
	name?: string;
	group?: number;
	order?: number;
}

export class Item implements IItem {
	id: number;
	name: string;
	group: number;
	order: number;

	constructor(values: IItem) {
		this.id = values.id | 0;
		this.name = values.name ? values.name : undefined;
		this.group = values.group | 0;
		this.order = values.order | 0;
	}
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'angular104fun';

	form = new FormGroup({
		pokemon: new FormControl(),
		swCharacter: new FormControl(),
		checked: new FormControl(),
		indeterminate: new FormControl(),
		radioButton: new FormControl(),
		fruitCtrl: new FormControl(),
	});

	// autocomplete chips
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];

	filteredFruits$: Observable<string[]> = this.form
		.get('fruitCtrl')
		.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) =>
				fruit ? this._filter(fruit) : this.allFruits.slice()
			)
		);

	fruits: string[] = ['Lemon'];
	allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

	languages: Language[] = languages;

	pokemons$ = this.form.get('pokemon').valueChanges.pipe(
		startWith(null),
		switchMap(name => {
			if (typeof name === 'string') {
				return of(pokemons).pipe(
					delay(800),
					map(response =>
						response.filter(p =>
							p.label.toUpperCase().includes(name)
						)
					)
				);
			}
			return of([]);
		})
	);

	swCharacters$ = this.form.get('swCharacter').valueChanges.pipe(
		startWith(null),
		switchMap(name => {
			if (typeof name === 'string') {
				return of(swCharacters).pipe(
					delay(800),
					map(response =>
						response.filter(p =>
							p.label.toUpperCase().includes(name)
						)
					)
				);
			}
			return of([]);
		})
	);

	constructor(public translate: TranslateService, readonly router: Router) {
		// set 'en' as default language
		translate.setDefaultLang('en');

		// if the user clicks the back button, ask the CanDeactivateGuard to defend against this.
		window.onpopstate = () =>
			(CanDeactivateState.defendAgainstBrowserBackButton = true);

		// Upon successful navigation, ensure that the CanDeactivateGuard no longer defends against back button clicks
		router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				tap(
					() =>
						(CanDeactivateState.defendAgainstBrowserBackButton = true)
				)
			)
			.subscribe();
	}

	ngOnInit() {}

	submit() {
		let i = new Item({
			id: 0,
			name: 'item1',
			group: 0,
			order: 0,
		});

		console.log(this.form.value, this.fruits, i);
	}

	// autocomplete chips
	add(event: MatChipInputEvent): void {
		console.log('Add', event);

		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.form.get('fruitCtrl').setValue(null);
	}

	blur(event: any) {
		console.log('Blur', event);
		this.fruitInput.nativeElement.value = '';
		this.form.get('fruitCtrl').setValue(null);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitInput.nativeElement.value = '';
		this.form.get('fruitCtrl').setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter(
			fruit => fruit.toLowerCase().indexOf(filterValue) === 0
		);
	}

	@ViewChild('sidenav') sidenav: MatSidenav;

	reason = '';

	close(reason: string) {
		this.reason = reason;
		this.sidenav.close();
	}

	shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h =>
		h.test(window.location.host)
	);
}
