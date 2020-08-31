import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-small-button',
	templateUrl: './small-button.component.html',
	styleUrls: ['./small-button.component.scss'],
})
export class SmallButtonComponent implements OnInit {
	// input disable property
	@Input()
	get disabled() {
		return this._disabled;
	}
	set disabled(disabled) {
		this._disabled = disabled;
	}
	public _disabled = false;

	// input tooltip message property
	@Input()
	get toolTipMessage() {
		return this._toolTipMessage;
	}
	set toolTipMessage(toolTipMessage) {
		this._toolTipMessage = toolTipMessage;
	}
	public _toolTipMessage = '';

	// input image caption property
	@Input()
	get imageCaption() {
		return this._imageCaption;
	}
	set imageCaption(imageCaption) {
		this._imageCaption = imageCaption;
	}
	public _imageCaption = 'home';

	// input image caption property
	@Input()
	get ngClassMatIcon() {
		return this._ngClassMatIcon;
	}
	set ngClassMatIcon(ngClassMatIcon) {
		this._ngClassMatIcon = ngClassMatIcon;
	}
	public _ngClassMatIcon = '';

	// input button property
	@Input()
	get ngClassMatIconButton() {
		return this._ngClassMatIconButton;
	}
	set ngClassMatIconButton(ngClassMatIconButton) {
		this._ngClassMatIconButton = ngClassMatIconButton;
	}
	public _ngClassMatIconButton = '';

	constructor() {}

	ngOnInit() {}
}
