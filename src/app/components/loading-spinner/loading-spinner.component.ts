import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading.service';

@Component({
	selector: 'app-loading-spinner',
	templateUrl: './loading-spinner.component.html',
	styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {
	constructor(public loadingService: LoadingService) {}

	ngOnInit() {}
}
