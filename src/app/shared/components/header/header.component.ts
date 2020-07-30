import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	@Output() toggleSidebar: EventEmitter<any> = new EventEmitter();
	@Output() languageChanged: EventEmitter<string> = new EventEmitter();

	numberOfNotifications: number = 22;
	constructor() {}

	ngOnInit(): void {}

	onLanguageChange(lang: string) {
		this.languageChanged.emit(lang);
	}

	setSidebar() {
		this.toggleSidebar.emit();
	}
}
