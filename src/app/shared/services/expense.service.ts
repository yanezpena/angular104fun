import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../../models/expense';

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	httpOptions = {
		headers: new HttpHeaders({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers':
				'Origin, X-Requested-With, Content-Type, Accept',
		}),
	};

	private baseUrl = 'http://localhost:9090/api/v1/expenses';
	private abaseUrl = 'http://localhost:9090/api/v1/attachments';

	constructor(private http: HttpClient) {}

	getExpenses() {
		return this.http.get<Expense[]>(`${this.baseUrl}`);
	}

	getExpense(id: string) {
		return this.http.get<Expense>(`${this.baseUrl}/${id}`);
	}

	deleteExpense(id: string) {
		return this.http.delete<Expense>(`${this.baseUrl}/${id}`);
	}

	updateExpense(expense: Expense) {
		return this.http.patch<Expense>(
			`${this.baseUrl}/${expense.id}`,
			expense
		);
	}

	createExpense(expense: Expense) {
		return this.http.post<Expense>(`${this.baseUrl}`, expense);
	}

	getExpenseImage(id: string) {
		console.log('getExpenseImage', `${this.abaseUrl}/${id}`);
		return this.http.get(`${this.abaseUrl}/${id}`);
	}

	createExpenseImage(receiptImage: File) {
		const headers = new HttpHeaders({
			Accept: 'application/json',
		});
		headers.delete('Content-Type');
		let options = { headers: headers };
		const formData: FormData = new FormData();
		formData.append('files', receiptImage);
		console.log(
			'createExpenseImage formData',
			receiptImage,
			formData,
			`${this.baseUrl}`
		);
		return this.http.post(`${this.abaseUrl}`, formData, options);
	}

	deleteExpenseImage(id: string) {
		console.log('deleteExpenseImage', `${this.abaseUrl}/${id}`);
		return this.http.delete(`${this.abaseUrl}/${id}`);
	}
}
