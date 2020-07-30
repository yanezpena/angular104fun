import { ExpenseService } from "../../shared/expense.service";
import { StateOptionService } from "../../shared/state-option.service";

import { Expense } from "../../models/Expense";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { v4 as uuid } from "uuid";
import { NotificationService } from "../../../shared/notification.service";
import { NgForm } from "@angular/forms";

@Component({
	selector: "app-create-expense",
	templateUrl: "./create-expense.component.html",
	styleUrls: ["./create-expense.component.css"]
})
export class CreateExpenseComponent implements OnInit {
	expense: Expense = new Expense();
	submitted = false;
	selectedFile: File = null;

	stateOptions = [];

	constructor(
		private expenseService: ExpenseService,
		private stateOptionService: StateOptionService,
		private notification: NotificationService,
		private router: Router
	) {}

	ngOnInit() {
		this.stateOptions = this.stateOptionService.getStateOptions();
		this.newExpense();
	}

	newExpense(): void {
		this.submitted = false;
		// init
		this.expense.name = "Service";
		this.expense.state = "draft";
		this.expense.subtotal = 10;
		this.expense.totalTax = 2;
		this.expense.total = 12;
		this.expense.description = "Carling";
	}

	save() {
		this.expense.id = uuid();
		this.expense.image = null;
		this.expense.total = this.expense.subtotal + this.expense.totalTax;
		return this.expenseService.createExpense(this.expense).subscribe(
			data =>
				this.notification.success(
					"Expense has been created.",
					"Create an Expense"
				),
			error =>
				this.notification.error(
					`Expense has not been created. Error: ${error}`,
					"Create an Expense"
				)
		);
	}

	onSubmit(curform: NgForm) {
		let frmCtrls = curform.controls;
		console.log(frmCtrls, frmCtrls.receipt.dirty);
		this.submitted = true;
		if (this.expense.image != null && frmCtrls.receipt.dirty) {
			this.createExpenseImage();
		} else {
			this.save();
		}
		this.gotoExpenseList();
	}

	createExpenseImage() {
		console.log("select File", this.selectedFile);
		if (this.selectedFile)
			this.expenseService.createExpenseImage(this.selectedFile).subscribe(
				data => {
					console.log("createExpenseImage", data);
					this.expense.imageId = data.toString();
					this.save();
				},
				error => console.log(error)
			);
		else {
			this.save();
		}
	}

	onCancel() {
		this.submitted = true;
		this.gotoExpenseList();
	}

	onFileSelected(event) {
		this.selectedFile = event.target.files[0];
		// console.log(this.selectedFile);
		this.readReceiptAndPreview(this.selectedFile);
	}

	onReceiptUpload(event) {}

	gotoExpenseList() {
		this.router.navigate(["expense-list"]);
	}

	// util functions

	readReceiptAndPreview(file: File) {
		// File Preview
		const reader = new FileReader();
		reader.onload = () => {
			this.expense.image = reader.result as string;
		};
		reader.readAsDataURL(file);
	}
}
