import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
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

	// current expense
	expense: Expense;
	currentId: string = null;

	// update or create expense
	creation: boolean = false;

	submitted: boolean = false;
	selectedFile: File = null;
	image;

	// get expense parameter from route
	expense$: Observable<Expense>;
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
				this.currentId = params['id'] || null;
				this.creation = !this.currentId;
				console.log('currentId', this.currentId);
				if (this.currentId) {
					// update
					this.expenseService
						.getExpense(this.currentId)
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
			receipt: [''],
			imageId: [''],
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
		this.submitted = false;
		this.expense = data as Expense;
		this.image = null;
		console.log('loadExpense', this.expense);
		if (this.expense.imageId != null) {
			this.expenseService.getExpenseImage(this.expense.imageId).subscribe(
				data => {
					this.image = ('data:image/jpeg;base64,' + data) as string;
					this.fillOutForm(this.expense);
					console.log('image loading', this.expense);
				},
				error => {
					console.log('image loading', error);
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
	}

	private fillOutExpense(): void {
		this.expense = {
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

	private save() {
		this.image = null;
		// check creation or not
		if (this.creation) {
			this.create();
		} else {
			this.update();
		}
	}

	private create() {
		this.expense.id = uuidv4();
		this.expenseService.createExpense(this.expense).subscribe(
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

	private update() {
		console.log('updateExpense', this.expense);
		this.expenseService.updateExpense(this.expense).subscribe(
			data =>
				this.notificationService.success(
					'Expense has been updated.',
					'Update an Expense'
				),
			error => {
				console.log('========>', error.error);
				this.notificationService.error(
					`Expense has not been updated.`,
					'Update an Expense'
				);
			}
		);
	}

	private createExpenseImage() {
		console.log('select File', this.selectedFile);
		if (this.selectedFile)
			this.expenseService.createExpenseImage(this.selectedFile).subscribe(
				data => {
					console.log('createExpenseImage', data);
					this.expense.imageId = data.toString();
					this.save();
				},
				error => {
					console.log(error);
					this.notificationService.error(
						'Receipts have not been created',
						'Create Expense Receipt'
					);
				}
			);
		else {
			this.save();
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
		this.fillOutExpense();
		// check image changes
		let controls = this.curForm.controls;
		console.log(controls, controls.receipt.dirty);
		this.submitted = true;
		if (this.image != null && controls.receipt.dirty) {
			this.createExpenseImage();
		} else {
			this.save();
		}
		this.gotoExpenseList();
	}

	onCancel() {
		this.submitted = true;
		this.gotoExpenseList();
	}

	onApprove() {}

	onFileSelected(event) {
		this.selectedFile = event.target.files[0];
		console.log(this.selectedFile);
		this.readReceiptAndPreview(this.selectedFile);
	}

	onReceiptUpload(event) {}

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

	// util functions

	private readReceiptAndPreview(file: File) {
		// File Preview
		const reader = new FileReader();
		reader.onload = () => {
			this.image = reader.result as string;
		};
		reader.readAsDataURL(file);
	}
}
