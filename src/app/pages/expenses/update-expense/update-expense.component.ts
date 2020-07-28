import { ExpenseService } from "../../../shared/expense.service";
import { StateOptionService } from "../../../shared/state-option.service";

import { Expense } from "../../../models/Expense";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AttachedFile } from "../../../models/AttachedFile";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IExpense } from "../../../models/IExpense";
import { NotificationService } from "../../../shared/notification.service";
import { NgForm } from "@angular/forms";

import Quill from "quill";

const parchment = Quill.import("parchment");
const block = parchment.query("block");
block.tagName = "DIV";
// or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
Quill.register(block /* or NewBlock */, true);

@Component({
	selector: "app-update-expense",
	templateUrl: "./update-expense.component.html",
	styleUrls: ["./update-expense.component.css"]
})
export class UpdateExpenseComponent implements OnInit {
	expense: Expense = new Expense();
	expense$: Observable<IExpense>;
	selectedId: string;

	submitted = false;
	selectedFile: File = null;
	attachments: AttachedFile[] = [];

	stateOptions = [];

	constructor(
		private expenseService: ExpenseService,
		private stateOptionService: StateOptionService,
		private notification: NotificationService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.stateOptions = this.stateOptionService.getStateOptions();
	}

	ngOnInit() {
		// gets id
		this.expense$ = this.route.paramMap.pipe(
			switchMap(params => {
				this.selectedId = params.get("id");
				return this.expenseService.getExpense(this.selectedId);
			})
		);
		this.loadExpense();
	}

	loadExpense(): void {
		this.submitted = false;
		// loads expense
		this.expense$.subscribe(
			data => {
				this.expense = data as Expense;
				this.expense.image = null;
				console.log("loadExpense", this.expense);
				if (this.expense.imageId != null)
					this.expenseService.getExpenseImage(this.expense.imageId).subscribe(
						data => {
							this.expense.image = ("data:image/jpeg;base64," + data) as string;
							console.log("loadExpense", this.expense);
						},
						error => {
							console.log(error);
						}
					);
			},
			error => {
				console.log(error);
			}
		);
	}

	save() {
		console.log("updateExpense", this.expense);
		this.expense.image = null;
		this.expense.total = this.expense.subtotal + this.expense.totalTax;
		this.expenseService.updateExpense(this.expense).subscribe(
			data =>
				this.notification.success(
					"Expense has been updated.",
					"Update an Expense"
				),
			error =>{
				console.log("========>", error.error);
				this.notification.error(
					`Expense has not been updated. Error: <strong>${error.status}-${error.statusText}</strong>`,
					"Update an Expense"
				)
			}
		);
	}

	onValidationForm(curform: NgForm) {
		console.log("invalid", curform.invalid, "valid", curform.valid);
		// form have not changed
		if(curform.pristine) return true;
		// validations
		if (curform.dirty && curform.invalid) return false;
		return true;
	}

	onSubmit(curform: NgForm) {
		if (!this.onValidationForm(curform)) return;
		let frmCtrls = curform.controls;
		console.log(frmCtrls);
		this.submitted = true;
		// TODO: this logic have to be on the microservice
		if (this.expense.imageId != null && frmCtrls.receipt.dirty) {
			this.expenseService.deleteExpenseImage(this.expense.imageId).subscribe(
				data => {
					console.log("first deleteExpenseImage", data);
					this.createExpenseImage();
				},
				error => console.log(error)
			);
		} else {
			this.createExpenseImage();
		}
		this.gotoExpenseList();
	}

	createExpenseImage() {
		console.log("select File", this.selectedFile);
		if (this.selectedFile)
			this.expenseService.createExpenseImage(this.selectedFile).subscribe(
				data => {
					console.log("updateExpenseImage", data);
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
		console.log("onCancel", this.selectedFile);
		this.submitted = true;
		this.gotoExpenseList();
	}

	onFileSelected(event) {
		this.selectedFile = event.target.files[0];
		this.readReceiptAndPreview(this.selectedFile);
		console.log("onFileSelected", this.selectedFile);
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
