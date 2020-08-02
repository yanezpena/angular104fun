import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  Injector,
  DoCheck,
  HostBinding
} from "@angular/core";
import Quill from "quill";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl
} from "@angular/forms";

import { Subject } from "rxjs";
import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { TranslateService } from "@ngx-translate/core";
import { takeUntil } from "rxjs/operators";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { MatFormFieldControl } from '@angular/material/form-field';


@Component({
  selector: "rich-text-editor",
  templateUrl: "./rich-text-editor.component.html",
  styleUrls: ["./rich-text-editor.component.scss"],

  // setDescribedByIds()
  host: {
      "[id]": "id",
      "[attr.aria-describedby]": "describedBy"
  },

  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RichTextEditorComponent),
          multi: true
      },
      {
          provide: MatFormFieldControl,
          useExisting: RichTextEditorComponent
      }
  ]
})
export class RichTextEditorComponent
  implements OnInit, DoCheck, ControlValueAccessor, MatFormFieldControl<any> {
  @Input()
  get customLabel() {
      return this._customLabel;
  }
  set customLabel(rtl) {
      this._customLabel = rtl;
      this.stateChanges.next();
  }
  public _customLabel: string;

  // Because the <mat-form-field> uses the OnPush change detection strategy, 
  // we need to let it know when something happens in the form field control 
  // that may require the form field to run change detection. 
  // We can do this via the stateChanges property.
  // We start we this because we need to emit on the stateChanges when value, 
  // focus, touched status, disabled and errorState changes.
  stateChanges = new Subject<void>();
  private unsubscribe: Subject<void> = new Subject();

  // This property returns the ID of an element in the component’s template 
  // that we want the <mat-form-field> to associate all of its labels 
  // and hints with. In this case, we'll use the host element and just 
  // generate a unique ID for it.
  // id: string;
  static nextId = 0;
  @HostBinding() id = `rich-editor-input-${RichTextEditorComponent.nextId++}`;

  // We make it possible for the user to specify custom form field’s 
  // placeholder via @Input() (just like matInput and mat-select does). 
  // Since the value of the placeholder may change over time, 
  // we need to make sure to trigger change detection in the parent 
  // form field by emitting on the stateChanges stream when the placeholder changes.
  //placeholder: string;
  @Input()
  get placeholder() {
      return this._placeholder;
  }
  set placeholder(plh) {
      // console.log('PLACEHOLDER',plh);
      this._placeholder = plh;
      this.stateChanges.next();
      if (this.editor != null) {
          this.editor.root.dataset.placeholder = this._placeholder;
      }
  }
  public _placeholder: string;

  // see ngOnInit()
  ngControl;

  // This property indicates whether or not the form field control 
  // should be considered to be in a focused state.
  // When it is in a focused state, the form field is displayed with a solid color underline.
  // We can use the FocusMonitor from @angular/cdk to easily check this. 
  // We also need to remember to emit on the stateChanges stream so change detection can happen.
  // We also want to stop monitoring for focus changes, when component is destroyed.
  focused: boolean;

  // This property indicates whether the form field control is empty. 
  //For our control, we’ll consider it empty if it hasn’t any character.
  // empty: boolean;
  get empty() {
      const commentText = this.editor.getText().trim();
      return commentText ? false : true;
  }

  // This property is used to indicate whether the label should be in the floating position. 
  // We’ll use the same logic as matInput and float the placeholder when the 
  // input is focused or non-empty.
  // shouldLabelFloat: boolean;
  @HostBinding("class.floating")
  get shouldLabelFloat() {
      return this.focused || !this.empty;
  }

  // This property is used to indicate whether the input is required. 
  // <mat-form-field> uses this information to add a required indicator 
  // to the placeholder. Don’t forget to run change detection if the required state changes.
  // required: boolean;
  @Input()
  get required() {
      return this._required;
  }
  set required(req) {
      this._required = coerceBooleanProperty(req);
      this.stateChanges.next();
  }
  public _required = false;

  // This property informs the form field when it should be in the disabled state. 
  // Again, don’t forget to run change detection if the disabled state changes.
  // disabled: boolean;
  @Input()
  get disabled() {
      return this._disabled;
  }
  set disabled(dis) {
      this._disabled = coerceBooleanProperty(dis);
      this.stateChanges.next();
  }
  public _disabled = false;

  @Input()
  get readOnly() {
      return this._readOnly;
  }
  set readOnly(ro) {
      this._readOnly = coerceBooleanProperty(ro);
      this.stateChanges.next();
  }
  public _readOnly = false;

  @Output() public textChange: EventEmitter<boolean> = new EventEmitter<
      boolean
  >();

  // This property indicates whether the associated NgControl is in an error state. 
  // Initially we set it to false, but we check for changes at ngDoCheck and change 
  // its value according to control’s validity.
  @Output() errorState: boolean = false;

  // This property allows us to specify a unique string for the type 
  // of control in form field. The <mat-form-field> will add an additional 
  // class based on this type that can be used to easily apply special 
  // styles to a <mat-form-field> that contains a specific type of control. 
  // In our component we'll use richeditor as our control type, 
  // which will result in the form field adding the class mat-form-field-richeditor.
  controlType?: string = "richeditor";
  autofilled?: boolean;

  // This method is used by the <mat-form-field> to specify the IDs that 
  // should be used for the aria-describedby attribute of your component. 
  // The method has one parameter, the list of IDs, we just need to apply 
  // the given IDs to our host element.
  // Now, we have to apply those IDs to our host element. (see @Component .... host)
  @HostBinding("attr.aria-describedby") describedBy = "";
  setDescribedByIds(ids: string[]) {
      this.describedBy = ids.join(" ");
  }

  // This method will be called when the form field is clicked on. 
  // It allows our component to hook in and handle that click however it wants. 
  // The method has one parameter, the MouseEvent for the click. 
  // In our case we'll just focus the <div> if the user isn't about to click an <div> anyways.
  onContainerClick(event: MouseEvent) {
      if ((event.target as Element).tagName.toLowerCase() != "div") {
          this.container.nativeElement.querySelector("div").focus();
      }
      // console.log("onContainerClick event: ", event);
  }

  @Input() quillBounds: string;

  @ViewChild("container", { read: ElementRef }) container: ElementRef;

  // This property allows us to set or get the value of our control. 
  // We should define it with the same type we used for the type parameter 
  // when we implemented MatFormFieldControl. The type we will use is any, 
  // because the value of Quill editor is a delta. As you can see below, 
  // we run the change detector when the value changes.
  //@Input() value: any;
  _value: any;
  get value(): any {
      console.log("GET VALUE", this._value);
      return this._value;
  }
  set value(value) {
      this._value = value;
      console.log("setContents", this._value);
      this.editor.setContents(this._value);
      this.onChange(value);
      this.stateChanges.next();
  }

  @Output() changed: EventEmitter<any> = new EventEmitter();
  //this one is important, otherwise 'Quill' is undefined
  quill: any = Quill;

  @Output()
  editor: any;
  // touched: boolean = false;
  // _value: any;

  constructor(
      public elRef: ElementRef,
      public injector: Injector,
      private fm: FocusMonitor,
      private translateService: TranslateService
  ) {
      //We can use the FocusMonitor from @angular/cdk to easily check this. 
      // We also need to remember to emit on the stateChanges stream 
      // so change detection can happen.
      fm.monitor(elRef.nativeElement, true).subscribe(origin => {
          this.focused = !!origin;
          this.stateChanges.next();
      });
  }

  @Input()
  get countVisible() {
      return this._countVisible;
  }
  set countVisible(cv) {
      this._countVisible = coerceBooleanProperty(cv);
      this.stateChanges.next();
  }
  public _countVisible = false;

  @Input()
  get inputLength() {
      return this._inputLength;
  }
  set inputLength(il) {
      this._inputLength = il;
      this.stateChanges.next();
  }
  public _inputLength = 0;

  @Input()
  get maxLength() {
      return this._maxLength;
  }
  set maxLength(il) {
      this._maxLength = il;
      this.stateChanges.next();
  }
  public _maxLength = 0;

  ngOnInit(): void {
      // This property allows the form field control to specify the 
      // @angular/forms control that is bound to this component. 
      // Since we have already set up our component to act as a ControlValueAccessor, 
      // we'll just set it to this in our component.
      // Notice that we didn’t inject ngControl at the constructor, because it causes 
      // Cyclic Dependency
      // We can inject it via Injector to avoid the error.
      // We need to import Injector.
      this.ngControl = this.injector.get(NgControl);
      if (this.ngControl != null) {
          this.ngControl.valueAccessor = this;
      }

      // console.log("READ ONLY IS", this._readOnly);
      let editor = this.container.nativeElement.querySelector("#editor");
      this.editor = new Quill(editor, {
          modules: {
              toolbar: [
                  ["bold", "italic", "underline"],
                  ["link"],
                  [{ list: "ordered" }, { list: "bullet" }]
              ]
          },
          bounds: this.quillBounds || editor,
          theme: "snow",
          placeholder: this.placeholder
      });

      this.editor.on("editor-change", (eventName, ...args) => {
          if (eventName !== "selection-change") {
              this.onChange(this.editor.getContents());
          }
      });

      //Text-change event
      this.watchTextChanges();

      var link = Quill.import("formats/link");
      var builtInFunc = link.sanitize;
      link.sanitize = function customSanitizeLinkInput(linkValueInput) {
          var val = linkValueInput;
          if (/^\w+:/.test(val)) {
          } else if (!/^https?:/.test(val)) val = "http://" + val;
          return builtInFunc.call(this, val);
      };

      this.localize(this.translateService.currentLang);
      this.translateService.onLangChange
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(value => {
              this.localize(value.lang);
          });
      if (this.required) {
          this;
      }
  }

  watchTextChanges() {
      this.editor.on("text-change", (delta, oldDelta, source) => {
          if (this.maxLength > 0 && this.editor.getLength() > this.maxLength) {
              this.editor.deleteText(this.maxLength, this.editor.getLength());
          }
          if (source == "api") {
              // console.log("An API call triggered this change.", this, delta);
              this.textChange.emit(false);
          } else if (source == "user") {
              // console.log("A user action triggered this change.", this);
              this.textChange.emit(true);
          }
          this._inputLength = this.editor.getLength() - 1;
      });
  }

  getHtml() {
      if (!this._value) return null;
      let delta = this._value.ops;
      let converter = new QuillDeltaToHtmlConverter(delta);
      let html = converter.convert();
      return html;
  }

  localize(lang) {
      if (lang == "en") {
          this.editor.container.classList.remove("fr");
      } else {
          this.editor.container.classList.add("fr");
      }
  }

  // We should make sure to complete stateChanges when our component is destroyed.
  // We also want to stop monitoring for focus changes, when component is destroyed.
  ngOnDestroy() {
      this.stateChanges.complete();
      this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  public isRequired() {
      return this.required && this.empty;
  }

  public isMaxLengthExceeded() {
      return this.maxLength > 0 && this._inputLength > this.maxLength;
  }

  // we used ngDoCheck lifecycle hook, so we need to import it and inform the 
  // class that we are going to implement it.
  // we check for changes at ngDoCheck and change its value according to control’s validity.
  ngDoCheck(): void {
      this.errorState = false;
      if (this.ngControl) {
          if (this.ngControl.touched) {
              this.setAnError(this.isRequired(), { required: true });
              this.setAnError(this.isMaxLengthExceeded(), { maxLength: true });
          }
          this.stateChanges.next();
      }
      // console.log("DO CHECK", this.errorState, this.empty);
  }

  setAnError(condition: boolean, errorType: any) {
      if (condition) {
          this.ngControl.control.setErrors(errorType);
          this.errorState = true;
      }
  }

  onChange = (delta: any) => {
      //this.setRichTextStyle();
      // this.validate(delta);
  };

  onTouched = () => {
      this.ngControl.touched = true;
      this.ngControl.required = this.required;

      console.log("TOUCHED", this.ngControl.touched, this.ngControl.required);
  };

  writeValue(delta: any): void {
      // console.log("DELTA", delta);
      this.editor.setContents(delta);
      this._value = delta;
  }

  registerOnChange(fn: (v: any) => void): void {
      // console.log("registerOnChange", fn);
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
      // console.log("registerOnTouched", fn);
      this.onTouched = fn;
  }

  validate({ value }: any) {
      console.log("======> validate rich text control");
      return {
          invalid: true
      }
  }
}
