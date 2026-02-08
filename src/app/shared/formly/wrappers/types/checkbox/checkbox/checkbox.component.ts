import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
})
export class CheckboxTypeComponent extends FieldType {
  get fc(): FormControl {
    return this.formControl as FormControl;
  }
}
