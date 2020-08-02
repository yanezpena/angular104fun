import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { DefaultComponent } from './default.component';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { ExpenseListComponent } from '../../modules/expenses/expense-list/expense-list.component';
import { ExpenseFormComponent } from '../../modules/expenses/expense-form/expense-form.component';
import { MaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from 'src/app/components/components.module';

// services
import { ExpenseService } from '../../shared/services/expense.service';
import { NotificationService } from '../../shared/services/notification.service';
import { StateOptionService } from 'src/app/shared/services/state-option.service';

@NgModule({
	declarations: [
		DefaultComponent,
		DashboardComponent,
		ExpenseListComponent,
		ExpenseFormComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		MaterialModule,
		TranslateModule,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [NotificationService, ExpenseService, StateOptionService],
})
export class DefaultModule {}
