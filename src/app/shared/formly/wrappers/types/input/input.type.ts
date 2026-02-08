import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-input-type',
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './input.type.html'
})
export class InputTypeComponent extends FieldType {
  get inputType(): string {
    return (this.props as any)?.inputType || 'text';
  }

  get fc(): FormControl {
    return this.formControl as FormControl;
  }

  get hasError(): boolean {
    return this.showError;
  }
}
