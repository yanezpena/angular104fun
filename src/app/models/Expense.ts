export class Expense {
	id: string;
	name: string;
	description?: string;
	state: string;
	image?: any;
	imageId?: string;
	total: number;
	totalTax: number;
	subtotal: number;
	entryDate: Date;
	updateDate: Date;
}