import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

// components
import { DefaultComponent } from './default.component';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { ExpensesComponent } from '../../modules/expenses/expenses.component';
import { MaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from 'src/app/components/components.module';

@NgModule({
	declarations: [DefaultComponent, DashboardComponent, ExpensesComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		MaterialModule,
    TranslateModule,
    ComponentModule
	],
})
export class DefaultModule {}
