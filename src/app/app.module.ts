import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// component module
import { ComponentModule } from './components/components.module';
import { DefaultModule } from './layouts/default/default.module';

// app config service
import { AppConfigService } from './shared/app-config.service';
// loading and spining service
import { LoadingService } from './shared/loading.service';

@NgModule({
	declarations: [AppComponent],
	imports: [
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: httpTranslateLoader,
				deps: [HttpClient],
			},
		}),
		ComponentModule,
		DefaultModule,
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: (appConfigService: AppConfigService) => {
				return () => {
					return appConfigService.loadAppConfig();
				};
			},
			deps: [AppConfigService],
			multi: true,
		},
		LoadingService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
