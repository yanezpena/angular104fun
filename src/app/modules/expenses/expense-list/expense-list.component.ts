import { Component, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../../../models/expense';
import { ExpenseService } from '../../../shared/services/expense.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
	MessageBox,
	MessageBoxIcon,
	MessageBoxButton,
	MessageBoxResult,
} from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'app-expense-list',
	templateUrl: './expense-list.component.html',
	styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
	private unsubcribe: Subject<void> = new Subject();
	awaitingExpenses: Expense[] = [];

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
		'select',
	];

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	dataSource = new MatTableDataSource<Expense>([]);

	expenses: Expense[];

	selection = new SelectionModel<Expense>(true, []);

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private expenseService: ExpenseService,
		private notificationService: NotificationService,
		private translateService: TranslateService
	) {}

	ngOnInit() {
		// set form defaults
		this.setFormDefaults();
		// filter
		this.dataSource.filterPredicate = this.filterFunction;
		// set paginator
		this.dataSource.paginator = this.paginator;
		// set sorter
		this.dataSource.sort = this.sort;
		// get expense list
		this.loadExpenses();
	}

	onSearchChange(value: string) {
		this.dataSource.filter = value;
	}

	setFormDefaults() {}

	filterFunction(u: Expense, value: string): boolean {
		if (value) {
			value = value.trim().toLowerCase();
			return (
				u.name.toLowerCase().includes(value) ||
				u.description.toLowerCase().includes(value)
			);
		} else {
			return true;
		}
	}

	loadExpenses() {
		console.log('loadExpenses');
		this.expenseService
			.getExpenses()
			.pipe(takeUntil(this.unsubcribe))
			.subscribe(
				expenseList => {
					this.expenses = expenseList;
					this.dataSource.data = this.expenses;
					// clear all selected expenses after refresh
					this.selection.clear();
				},
				error => {
					this.notificationService.error(
						`Expenses have not been loaded.`,
						'Loading Expenses'
					);
					console.log(error);
				}
			);
	}

	remove(expense: Expense) {
		MessageBox.show(
			this.dialog,
			this.translateService.instant('delete_message_box_question'),
			this.translateService.instant('delete_message_box_tittle'),
			MessageBoxButton.YesNo,
			null,
			false,
			MessageBoxIcon.Question
		).subscribe(result => {
			if (result === MessageBoxResult.Yes) {
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
										this.notificationService.success(
											'Expense has been deleted.',
											'Delete an Expense'
										),
									error =>
										this.notificationService.error(
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

	update(record: Expense) {
		console.log('update', record);
		this.router.navigate(['expense-form', { id: record.id }]);
	}

	refresh() {
		this.loadExpenses();
	}

	search() {}

	attachImage(selectedFile: any) {
		console.log('attachImage', selectedFile);
	}

	// select checkbox

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}

	// helpers
}
