import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-form-field-wrapper',
  imports: [CommonModule, FormlyModule],
  templateUrl: './form-field.wrapper.html'
})
export class FormFieldWrapperComponent extends FieldWrapper { }
