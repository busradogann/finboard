import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { InputTypeComponent } from './types/input/input.type';
import { SelectboxTypeComponent } from './types/selectbox/selectbox.type';
import { FormFieldWrapperComponent } from './form-field/form-field/form-field.wrapper';
import { CheckboxTypeComponent } from './types/checkbox/checkbox/checkbox.component';

@NgModule({
	imports: [
		FormFieldWrapperComponent,
		InputTypeComponent,
		SelectboxTypeComponent,

		FormlyModule.forChild({
			wrappers: [
				{ name: 'form-field', component: FormFieldWrapperComponent },
			],
			types: [
				{
					name: 'input',
					component: InputTypeComponent,
					wrappers: ['form-field'],
				},
				{
					name: 'selectbox',
					component: SelectboxTypeComponent,
					wrappers: ['form-field'],
				},
				{
					name: 'checkbox',
					component: CheckboxTypeComponent,
					wrappers: ['form-field'],
				},
			],
		}),
	], exports: [SelectboxTypeComponent, FormlyModule],
})
export class SharedFormlyModule { }
