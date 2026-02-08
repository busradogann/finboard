import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';

type SelectOption = { label: string; value: any };

@Component({
  selector: 'app-formly-selectbox-type',
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './selectbox.type.html'
})
export class SelectboxTypeComponent extends FieldType {
  get fc(): FormControl {
    return this.formControl as FormControl;
  }

  get selectOptions(): SelectOption[] {
    return ((this.props as any)?.options as SelectOption[]) || [];
  }

  get hasError(): boolean {
    return this.showError;
  }
}
