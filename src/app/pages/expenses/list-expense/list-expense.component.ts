import { Component, OnInit } from "@angular/core";
import { IExpense } from "../../../models/IExpense";
import { ExpenseService } from "../../shared/expense.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/shared/notification.service";

@Component({
	selector: "app-list-expense",
	templateUrl: "list-expense.component.html",
	styleUrls: ["list-expense.component.scss"]
})
export class ListExpenseComponent implements OnInit {
	private unsubcribe: Subject<void> = new Subject();
	awaitingExpenses: IExpense[] = [];

	expenses: IExpense[];

	editField: string;

	constructor(
		private expenseService: ExpenseService,
		private notification: NotificationService,
		private router: Router
	) {}

	ngOnInit() {
		// get expense list
		this.loadExpenses();
	}

	loadExpenses() {
		this.expenseService
			.getExpenses()
			.pipe(takeUntil(this.unsubcribe))
			.subscribe(expenseList => {
				this.expenses = expenseList;
			});
	}

	updateList(idx: number, property: string, event: any) {
		const editField = event.target.textContent;
		this.expenses[idx][property] = editField;
	}

	remove(idx: any, expense: IExpense) {
		this.expenseService.deleteExpense(expense.id).subscribe(
			data => {
				console.log(data);
				this.expenses.splice(idx, 1);
				if (expense.imageId)
					this.expenseService.deleteExpenseImage(expense.imageId).subscribe(
						data =>
							this.notification.success(
								"Expense has been deleted.",
								"Delete an Expense"
							),
						error =>
							this.notification.error(
								`Expense has not been deleted. Error: ${error}`,
								"Delete an Expense"
							)
					);
			},
			error => console.log(error)
		);
	}

	add() {
		this.router.navigate(["expense-add"]);
	}

	update(id: string) {
		this.router.navigate(["expense-update", { id: id }]);
	}

	changeValue(id: number, property: string, event: any) {
		this.editField = event.target.textContent;
	}

	refresh() {
		this.loadExpenses();
	}

	attachImage(selectedFile: any) {
		console.log("attachImage", selectedFile);
	}

	// helpers
}
