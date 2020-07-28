import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IExpense } from "../models/IExpense";

@Injectable({
	providedIn: "root"
})
export class ExpenseService {
	httpOptions = {
		headers: new HttpHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers":
				"Origin, X-Requested-With, Content-Type, Accept"
		})
	};

	private baseUrl = "http://localhost:9090/api/v1/expenses";
	private abaseUrl = "http://localhost:9090/api/v1/attachments";

	constructor(private http: HttpClient) {}

	getExpenses() {
		return this.http.get<IExpense[]>(`${this.baseUrl}`);
	}

	getExpense(id: string) {
		// console.log("expense id", id);
		return this.http.get<IExpense>(`${this.baseUrl}/${id}`);
	}

	deleteExpense(id: string) {
		return this.http.delete<IExpense>(`${this.baseUrl}/${id}`);
	}

	updateExpense(expense: IExpense) {
		return this.http.patch<IExpense>(`${this.baseUrl}/${expense.id}`, expense);
	}

	createExpense(expense: IExpense) {
		return this.http.post<IExpense>(`${this.baseUrl}`, expense);
	}

	getExpenseImage(id: string){
		console.log("getExpenseImage", `${this.abaseUrl}/${id}`);
		return this.http.get(`${this.abaseUrl}/${id}`);
	}

	createExpenseImage(receiptImage: File){
		const headers = new HttpHeaders({
			'Accept': 'application/json'
		});
		headers.delete('Content-Type');
		let options = {headers: headers};
		const formData: FormData = new FormData();
		formData.append('files', receiptImage);
		console.log("createExpenseImage formData", receiptImage, formData, `${this.baseUrl}`);
		return this.http.post(`${this.abaseUrl}`, formData, options);
	}

	deleteExpenseImage(id: string){
		console.log("deleteExpenseImage", `${this.abaseUrl}/${id}`);
		return this.http.delete(`${this.abaseUrl}/${id}`);
	}
	// uploadReceipt(receipt: FormData) {
	// 	this.http
	// 		.post(this.baseUrl, receipt, {
	// 			reportProgress: true,
	// 			observe: "events"
	// 		})
	// 		.subscribe(event => {
	// 			if (event.type === HttpEventType.UploadProgress){
	// 				console.log(Math.round(event.total/event.loaded * 100) + '%')
	// 			} else if (event.type === HttpEventType.Response){
	// 				console.log(event);
	// 			}
	// 		});
	// }
}
