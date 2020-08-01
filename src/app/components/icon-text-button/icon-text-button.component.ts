import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'app-icon-text-button',
	templateUrl: './icon-text-button.component.html',
	styleUrls: ['./icon-text-button.component.scss'],
})
export class IconTextButtonComponent implements OnInit {
	@Output() click: EventEmitter<Event> = new EventEmitter();
	@Input() icon: string;
	@Input() text: string;
	@Input() textTooltip: string;
	@Input() color: string;
	@Input() ngIconClass: string;

	constructor() {}

	ngOnInit(): void {
		console.log(this.ngIconClass);
	}

	onClick(event: any) {
		this.click.emit(event);
	}
}
