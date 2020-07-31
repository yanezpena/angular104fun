import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";

class ImageSnippet {
	pending: boolean = false;
	status: string = "init";

	constructor(public src: string, public file: File) {}
}

@Component({
	selector: "app-attach-file",
	templateUrl: "./attach-file.component.html",
	styleUrls: ["./attach-file.component.scss"]
})
export class AttachFileComponent {
	// input disable property
	@Input()
	get disabled() {
		return this._disabled;
	}
	set disabled(disabled) {
		this._disabled = disabled;
	}
	public _disabled = false;

	// input semantic style property
	@Input()
	get semanticClass() {
		return this._semanticClass;
	}
	set semanticClass(semanticClass) {
		this._semanticClass = semanticClass;
	}
	public _semanticClass = "btn-secondary";

	// input tooltip message property
	@Input()
	get toolTipMessage() {
		return this._toolTipMessage;
	}
	set toolTipMessage(toolTipMessage) {
		this._toolTipMessage = toolTipMessage;
	}
	public _toolTipMessage = "";

	// input image caption property
	@Input()
	get imageCaption() {
		return this._imageCaption;
	}
	set imageCaption(imageCaption) {
		this._imageCaption = imageCaption;
	}
	public _imageCaption = "tim-icons icon-simple-add";

	// change event
	@Output() attach = new EventEmitter<Event>();

	selectedFile: ImageSnippet;

	constructor() {}

	onChange(selectedFile) {
		console.log("onChange", selectedFile.files);
		this.attach.emit(selectedFile.files);
	}

	// onFileSelectSeted(event){
	//   console.log(event.target.files[0]);
	//   // this.onUploadFile(event.target.files[0]);
	// }

	// onUploadFile(selectedFile){
	//   this.processFile(selectedFile);
	// }

	// private onSuccess() {
	//   this.selectedFile.pending = false;
	//   this.selectedFile.status = 'ok';
	// }

	// private onError() {
	//   this.selectedFile.pending = false;
	//   this.selectedFile.status = 'fail';
	//   this.selectedFile.src = '';
	// }

	// processFile(imageInput: File) {
	//   const file: File = imageInput;
	//   const reader = new FileReader();

	//   reader.addEventListener('load', (event: any) => {

	//     this.selectedFile = new ImageSnippet(event.target.result, file);

	//     this.selectedFile.pending = true;
	//     this.uploadFile(this.selectedFile.file).subscribe(
	//       (res) => {
	//         this.onSuccess();
	//       },
	//       (err) => {
	//         this.onError();
	//       })
	//   });

	//   reader.readAsDataURL(file);
	//   console.log(reader);
	// }

	// public uploadFile(file: File): Observable<Response> {
	//   const formData = new FormData();
	//   formData.append('image', file);

	//   return this.uploadFileService.post<any>('/api/v1/image-upload', formData);
	// }
}
