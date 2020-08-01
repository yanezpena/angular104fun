import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Expense } from '../../../models/Expense';
import { ExpenseService } from '../../../shared/expense.service';
import { StateOptionService } from '../../../shared/state-option.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
	selector: 'app-expense-form',
	templateUrl: './expense-form.component.html',
	styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent implements OnInit {
	// constants
	NAME_MAX_LEN = 250;

	// form and control
	curForm: FormGroup;

	expense: Expense;
	submitted = false;
	selectedFile: File = null;

	stateOptions = [];

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private expenseService: ExpenseService,
		private stateOptionService: StateOptionService,
		private notification: NotificationService
	) {}

	ngOnInit() {
		console.log('ngOnInit');
		this.setDefaults();
		this.stateOptions = this.stateOptionService.getStateOptions();
		this.newExpense();
	}

	setDefaults() {
		this.curForm = this.fb.group({
			id: null,
			name: [
				'',
				[Validators.required, Validators.maxLength(this.NAME_MAX_LEN)],
			],
			description: ['', [Validators.required]],
			state: ['draft', [Validators.required]],
			subtotal: [0, [Validators.required]],
			totalTax: [0, [Validators.required]],
			total: [0, [Validators.required]],
			entryDate: [new Date(), [Validators.required]],
		});
	}

	getTitle(): string {
		return 'Create an Expense';
	}

	newExpense(): void {
		this.submitted = false;
		// init
		this.expense = {
			name: 'Service',
			state: 'draft',
			subtotal: 10,
			totalTax: 2,
			total: 12,
			description: 'Carling',
		} as Expense;
	}

	save() {
		this.expense.id = `6ec0c700-d841-4814-92b4-b3c4017c9bb9`; //uuid();
		this.expense.image = null;
		this.expense.total = this.expense.subtotal + this.expense.totalTax;
		return this.expenseService.createExpense(this.expense).subscribe(
			data =>
				this.notification.success(
					'Expense has been created.',
					'Create an Expense'
				),
			error =>
				this.notification.error(
					`Expense has not been created. Error: ${error}`,
					'Create an Expense'
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
		console.log('select File', this.selectedFile);
		if (this.selectedFile)
			this.expenseService.createExpenseImage(this.selectedFile).subscribe(
				data => {
					console.log('createExpenseImage', data);
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
		this.router.navigate(['expense-list']);
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
