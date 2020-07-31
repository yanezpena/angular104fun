import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';

// components
import { InputAutocompleteComponent } from '../components/input-autocomplete/input-autocomplete.component';
import { SelectLanguageComponent } from '../components/select-language/select-language.component';
import { SamllButtonComponent } from '../components/small-button/small-button.component';
import { MessageDialogComponent } from '../components/message-dialog/message-dialog.component';

// loading and spining
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
	declarations: [
		InputAutocompleteComponent,
		SelectLanguageComponent,
		LoadingSpinnerComponent,
		SamllButtonComponent,
		MessageDialogComponent,
	],
	imports: [
		CommonModule,
		BrowserAnimationsModule,
		MaterialModule,
		FormsModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		TranslateModule,
	],
	exports: [
		InputAutocompleteComponent,
		SelectLanguageComponent,
		LoadingSpinnerComponent,
		SamllButtonComponent,
		MessageDialogComponent,
	],
	providers: [TranslateService],
})
export class ComponentModule {}
