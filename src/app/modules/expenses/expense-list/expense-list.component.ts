import { Component, OnInit, ViewChild } from '@angular/core';
import { IExpense } from '../../../models/IExpense';
import { ExpenseService } from '../../../shared/expense.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
	MessageBox,
	MessageIcon,
	MessageBoxButton,
	MessageResult,
} from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-expense-list',
	templateUrl: './expense-list.component.html',
	styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
	private unsubcribe: Subject<void> = new Subject();
	awaitingExpenses: IExpense[] = [];

	displayedColumns: string[] = [
		'name',
		'description',
		'state',
		'entryDate',
		'updateDate',
		'subtotal',
		'totalTax',
		'total',
		'actions',
	];

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	dataSource = new MatTableDataSource<IExpense>([]);

	expenses: IExpense[];

	editField: string;

	constructor(
		private router: Router,
		private expenseService: ExpenseService,
		private notification: NotificationService,
		private translateService: TranslateService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		// get expense list
		this.loadExpenses();
		// set paginator
		this.dataSource.paginator = this.paginator;
	}

	loadExpenses() {
		this.expenseService
			.getExpenses()
			.pipe(takeUntil(this.unsubcribe))
			.subscribe(expenseList => {
				this.expenses = expenseList;
				this.dataSource.data = this.expenses;
			});
	}

	updateList(idx: number, property: string, event: any) {
		const editField = event.target.textContent;
		this.expenses[idx][property] = editField;
	}

	remove(expense: IExpense) {
		MessageBox.show(
			this.dialog,
			this.translateService.instant('delete_message_box_question'),
			this.translateService.instant('delete_message_box_tittle'),
			MessageBoxButton.YesNo,
			null,
			false,
			MessageIcon.Question
		).subscribe(data => {
			if (data.result === MessageResult.Yes) {
				this.expenseService.deleteExpense(expense.id).subscribe(
					data => {
						console.log(data);
						this.expenses = this.expenses.filter(
							item => item.id == expense.id
						);
						if (expense.imageId)
							this.expenseService
								.deleteExpenseImage(expense.imageId)
								.subscribe(
									data =>
										this.notification.success(
											'Expense has been deleted.',
											'Delete an Expense'
										),
									error =>
										this.notification.error(
											`Expense has not been deleted. Error: ${error}`,
											'Delete an Expense'
										)
								);
					},
					error => console.log(error)
				);
			}
		});
	}

	add() {
		this.router.navigate(['expense-form']);
	}

	update(id: string) {
		this.router.navigate(['expense-form', { id: id }]);
	}

	changeValue(id: number, property: string, event: any) {
		this.editField = event.target.textContent;
	}

	refresh() {
		this.loadExpenses();
	}

	attachImage(selectedFile: any) {
		console.log('attachImage', selectedFile);
	}

	// helpers
}
