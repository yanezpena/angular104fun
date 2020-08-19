import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ExpenseService } from '../../../shared/services/expense.service';
import { StateOptionService } from '../../../shared/services/state-option.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Expense } from 'src/app/models/expense';

@Component({
	selector: 'app-expense-form',
	templateUrl: './expense-form.component.html',
	styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit {
	// constants
	NAME_MAX_LEN = 250;

	// form and control
	curForm: FormGroup;

	// update or create expense
	creation: boolean = false;

	selectedImageFile: File = null;
	private unsubscribe: Subject<void> = new Subject();

	stateOptions = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private expenseService: ExpenseService,
		private stateOptionService: StateOptionService,
		private notificationService: NotificationService
	) {}

	ngOnInit() {
		console.log('ngOnInit');
		// get master data collections
		this.getStaticCollections();
		// set form defaults
		this, this.setFormDefaults();
		// get expense from url parameters
		this.getCurrentExpenseFromParam();
		// field interactions
		this.fieldInteractions();
	}

	private getStaticCollections() {
		this.stateOptions = this.stateOptionService.getStateOptions();
	}

	getCurrentExpenseFromParam() {
		// get url record parameters
		this.creation = true;
		this.route.params
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(params => {
				const currentId = params['id'] || null;
				this.creation = !currentId;
				console.log('currentId', currentId);
				if (currentId) {
					// update
					this.expenseService
						.getExpense(currentId)
						.pipe(takeUntil(this.unsubscribe))
						.subscribe(
							data => {
								this.loadExpense(data);
							},
							error => {
								console.log('error', error);
								this.notificationService.error(
									'Expense has not been loaded',
									'Loading Expense'
								);
							}
						);
				}
			});
	}

	private setFormDefaults() {
		this.curForm = this.fb.group({
			id: null,
			name: [
				'Service',
				[Validators.required, Validators.maxLength(this.NAME_MAX_LEN)],
			],
			description: ['', [Validators.required]],
			state: ['draft', [Validators.required]],
			subtotal: [0, [Validators.required]],
			totalTax: [0, [Validators.required]],
			total: [0, [Validators.required]],
			entryDate: [new Date(), [Validators.required]],
			imageId: null,
			// extra fields
			receipt: null,
			image: null,
		});
	}

	private fieldInteractions() {
		const form = this.curForm;
		form.get('subtotal').valueChanges.subscribe(value => {
			form.get('total').setValue(value + form.get('totalTax').value);
		});
		form.get('totalTax').valueChanges.subscribe(value => {
			form.get('total').setValue(value + form.get('subtotal').value);
		});
	}

	private loadExpense(data: any): void {
		// loads expense
		const expense = data as Expense;
		// load expense
		this.fillOutForm(expense);
		// load image
		if (expense.imageId) {
			this.expenseService.getExpenseImage(expense.imageId).subscribe(
				data => {
					this.setImage(('data:image/jpeg;base64,' + data) as string);
					console.log('image loading', expense);
				},
				error => {
					// todo: set image error
					this.notificationService.error(
						'Receipts have not been loaded',
						'Loading Expense'
					);
				}
			);
		}
	}

	private fillOutForm(expense: Expense) {
		this.curForm.patchValue({
			...expense,
		});
		console.log('loadExpense - refresh form', expense);
	}

	private fillOutExpense(): Expense {
		return {
			id: this.curForm.get('id').value,
			name: this.curForm.get('name').value,
			description: this.curForm.get('description').value,
			state: this.curForm.get('state').value,
			subtotal: this.curForm.get('subtotal').value,
			totalTax: this.curForm.get('totalTax').value,
			total: this.curForm.get('total').value,
			entryDate: this.curForm.get('entryDate').value,
			updateDate: new Date(),
			imageId: this.curForm.get('imageId').value,
		} as Expense;
	}

	private save(expense: Expense) {
		this.setImage();
		// check creation or not
		if (this.creation) {
			this.create(expense);
		} else {
			this.update(expense);
		}
	}

	private create(expense: Expense) {
		this.expenseService.createExpense(expense).subscribe(
			data =>
				this.notificationService.success(
					'Expense has been created.',
					'Create an Expense'
				),
			error =>
				this.notificationService.error(
					`Expense has not been created.`,
					'Create an Expense'
				)
		);
	}

	private update(expense: Expense) {
		console.log('updateExpense', expense);
		this.expenseService.updateExpense(expense).subscribe(
			data =>
				this.notificationService.success(
					'Expense has been updated.',
					'Update an Expense'
				),
			error => {
				this.notificationService.error(
					`Expense has not been updated.`,
					'Update an Expense'
				);
			}
		);
	}

	private createExpenseImage(file: File, expense: Expense) {
		console.log('Image File', file);
		if (file)
			this.expenseService.createExpenseImage(file).subscribe(
				data => {
					console.log('Expense Image Id', data);
					expense.imageId = data.toString();
					this.save(expense);
				},
				error => {
					console.log(error);
					this.notificationService.error(
						'Receipts have not been created',
						'Create Expense Receipt'
					);
					expense.imageId = null;
					this.save(expense);
				}
			);
		else {
			this.save(expense);
		}
	}

	private validationForm() {
		console.log(
			'invalid',
			this.curForm.invalid,
			'valid',
			this.curForm.valid
		);
		// form have not changed
		if (this.curForm.pristine) return true;
		// validations
		if (this.curForm.dirty && this.curForm.invalid) return false;
		return true;
	}

	onSave() {
		// validate form
		if (!this.validationForm()) return;
		// update current expense from form
		let expense = this.fillOutExpense();
		// check image changes
		let controls = this.curForm.controls;
		console.log(controls, controls.receipt.dirty);
		if (this.getImage() != null && controls.receipt.dirty) {
			this.createExpenseImage(this.selectedImageFile, expense);
		} else {
			this.save(expense);
		}
		this.gotoExpenseList();
	}

	onCancel() {
		this.gotoExpenseList();
	}

	onApprove() {}

	onDetach() {
		// clean image
		this.setImage();
	}

	onFileSelected(event) {
		this.selectedImageFile = event.target.files[0];
		console.log(this.selectedImageFile);
		this.readReceiptAndPreview(this.selectedImageFile);
	}

	onReceiptUpload(event) {}

	// util functions

	setImage(value = null) {
		this.curForm.patchValue({ image: value });
	}

	public getImage() {
		return this.curForm.get('image').value;
	}

	gotoExpenseList() {
		this.router.navigate(['expenses']);
	}

	getTitle(): string {
		return (
			(this.creation && 'create_expense_title') || 'update_expense_title'
		);
	}

	getSubTitle(): string {
		return (
			(this.creation && 'create_expense_subtitle') ||
			'update_expense_subtitle'
		);
	}

	private readReceiptAndPreview(file: File) {
		// File Preview
		const reader = new FileReader();
		reader.onload = () => {
			this.setImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	}
}
