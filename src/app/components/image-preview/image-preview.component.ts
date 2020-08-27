import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-image-preview',
	templateUrl: './image-preview.component.html',
	styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
	// input tooltip message property
	@Input()
	get toolTipMessage() {
		return this._toolTipMessage;
	}
	set toolTipMessage(toolTipMessage) {
		this._toolTipMessage = toolTipMessage;
	}
	public _toolTipMessage = '';

	@Input() image: string = '';

	// detach event
	@Output() detach = new EventEmitter<Event>();

	// image click  event
	@Output() imageClick = new EventEmitter<Event>();

	constructor() {}

	ngOnInit(): void {}

	onDetach(event: Event) {
		this.detach.emit(event);
	}

	onImageClick() {
		this.imageClick.emit(event);
	}
}
