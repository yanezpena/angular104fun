import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class AppConfigService {
	private _appConfig: AppConfig;

	private unsubscribe: Subject<void> = new Subject();

	constructor(private http: HttpClient) {}

	loadAppConfig() {
		this.http
			.get<AppConfig>('./assets/config/app-config.json')
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(response => {
				this._appConfig = response;
				console.log('loadAppConfig', this._appConfig);
			});
	}

	get getAppConfig(): AppConfig {
		if (!this._appConfig) {
			return {} as AppConfig;
		}
		return this._appConfig;
	}
}

export class AppConfig {
	setting1: string = '';
}
