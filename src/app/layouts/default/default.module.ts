import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

// components
import { DefaultComponent } from './default.component';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { ExpenseListComponent } from '../../modules/expenses/expense-list/expense-list.component';
import { MaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from 'src/app/components/components.module';

// services
import { ExpenseService } from '../../shared/expense.service';
import { NotificationService } from '../../shared/services/notification.service';

@NgModule({
	declarations: [DefaultComponent, DashboardComponent, ExpenseListComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		MaterialModule,
		TranslateModule,
		ComponentModule,
	],
	providers: [NotificationService, ExpenseService],
})
export class DefaultModule {}
