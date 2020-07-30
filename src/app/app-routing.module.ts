import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ExpenseListComponent } from './modules/expenses/expense-list/expense-list.component';

const routes: Routes = [
	{
		path: '',
		component: DefaultComponent,
		children: [
			{
				path: '',
				component: DashboardComponent,
			},
			{
				path: 'expenses',
				component: ExpenseListComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
