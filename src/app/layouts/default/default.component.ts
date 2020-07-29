import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
	sidebarOpen: boolean = false;

	constructor(public translateService: TranslateService) {}

	ngOnInit(): void {}

	sidebarToggler() {
		this.sidebarOpen = !this.sidebarOpen;
	}

	onLanguageChanged(lang: string) {
		console.log('languageChanged', lang);
		this.translateService.use(lang);
	}
}
