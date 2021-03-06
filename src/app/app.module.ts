import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// component module
import { ComponentModule } from './components/components.module';
import { DefaultModule } from './layouts/default/default.module';

// app config service
import { AppConfigService } from './shared/services/app-config.service';

// loading and spinning service
import { NotificationService } from './shared/services/notification.service';

// services
import { StateOptionService } from './shared/services/state-option.service';
import { ExpenseService } from './shared/services/expense.service';

// guards
import { HasUnsavedChangesGuard } from './guards/has-unsaved-changes.guard';

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
		ToastrModule.forRoot({
			timeOut: 1000,
			progressBar: true,
			progressAnimation: 'decreasing',
			preventDuplicates: true,
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
		NotificationService,
		ExpenseService,
		StateOptionService,
		HasUnsavedChangesGuard,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
