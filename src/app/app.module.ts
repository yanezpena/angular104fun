import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { InputAutocompleteComponent } from './components/input-autocomplete/input-autocomplete.component';
import { SelectLanguageComponent } from './components/select-language/select-language.component';

// translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// app config
import { AppConfigService } from './shared/app-config.service';

// loading and spining
import { LoadingService } from './shared/loading.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
	declarations: [
		AppComponent,
		InputAutocompleteComponent,
		SelectLanguageComponent,
		LoadingSpinnerComponent,
	],
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
