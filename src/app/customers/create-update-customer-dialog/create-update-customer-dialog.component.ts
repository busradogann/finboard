import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import { CustomerService } from '../../services/customer.service';
import { CustomerResponse } from '../../models/customers/customers.response.model';
import { CreateCustomerRequest, UpdateCustomerRequest } from '../../models/customers/customers.request.model';
import { CustomerDialogData } from '../../models/customers/customer-dialog.model';

@Component({
  selector: 'app-customer-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, TranslateModule],
  templateUrl: './create-update-customer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormDialogComponent {
  private customerService = inject(CustomerService);
  private translateService = inject(TranslateService);
  private dialogRef = inject(DialogRef<CustomerResponse | null>);
  private data = inject<CustomerDialogData>(DIALOG_DATA);

  private t(key: string) {
    return this.translateService.instant(key);
  }

  mode = this.data.mode; // create | update
  customerId = this.data.customer?.id;

  submitting = false;
  errorMsg: string | null = null;

  form = new FormGroup({});

  model: Partial<CreateCustomerRequest> = {
    name: this.data.customer?.name ?? '',
    email: this.data.customer?.email ?? '',
    phone: this.data.customer?.phone ?? '',
    dateOfBirth: this.data.customer?.dateOfBirth ?? '',
    nationalId: this.data.customer?.nationalId ?? (null as any),
    address: {
      country: this.data.customer?.address?.country ?? '',
      city: this.data.customer?.address?.city ?? '',
      postalCode: this.data.customer?.address?.postalCode ?? '',
      line1: this.data.customer?.address?.line1 ?? '',
    },
    ...(this.data.initial ?? {}),
  };

  titleKey = this.mode === 'create' ? 'CUSTOMERS.ADD.TITLE' : 'CUSTOMERS.EDIT.TITLE';
  subtitleKey = this.mode === 'create' ? 'CUSTOMERS.ADD.SUBTITLE' : 'CUSTOMERS.EDIT.SUBTITLE';
  submitKey = this.mode === 'create' ? 'COMMON.SAVE' : 'COMMON.UPDATE';
  submittingKey = this.mode === 'create' ? 'COMMON.SAVING' : 'COMMON.UPDATING';

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-1 gap-4 md:grid-cols-2',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          props: {
            label: this.t('CUSTOMERS.ADD.FORM.NAME'),
            placeholder: this.t('CUSTOMERS.ADD.FORM.NAME_PH'),
            required: true,
          },
        },
        {
          key: 'email',
          type: 'input',
          props: {
            type: 'email',
            label: this.t('CUSTOMERS.ADD.FORM.EMAIL'),
            placeholder: this.t('CUSTOMERS.ADD.FORM.EMAIL_PH'),
            required: true,
            defaultValue: this.data.customer?.email ?? '',
          },
        },
        {
          key: 'phone',
          type: 'input',
          props: {
            label: this.t('CUSTOMERS.ADD.FORM.PHONE'),
            placeholder: this.t('CUSTOMERS.ADD.FORM.PHONE_PH'),
            required: true,
            defaultValue: this.data.customer?.phone ?? '',
          },
        },
        {
          key: 'dateOfBirth',
          type: 'input',
          props: {
            type: 'date',
            label: this.t('CUSTOMERS.ADD.FORM.DOB'),
            required: true,
            defaultValue: this.data.customer?.dateOfBirth ? (this.data.customer.dateOfBirth as string).slice(0, 10) : '',
          },
        },
        {
          key: 'nationalId',
          type: 'input',
          props: {
            type: 'number',
            label: this.t('CUSTOMERS.ADD.FORM.NATIONAL_ID'),
            placeholder: this.t('CUSTOMERS.ADD.FORM.NATIONAL_ID_PH'),
            required: true,
            defaultValue: this.data.customer?.nationalId ?? (null as any),
          },
        },
      ],
    },
    {
      template: `<div class="mt-6 mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        ${this.t('CUSTOMERS.ADD.FORM.ADDRESS_TITLE')}
      </div>`,
    },
    {
      key: 'address',
      fieldGroupClassName: 'grid grid-cols-1 gap-4 md:grid-cols-2',
      fieldGroup: [
        {
          key: 'country',
          type: 'input',
          props: {
            label: this.t(
              'CUSTOMERS.ADD.FORM.COUNTRY'
            ), required: true
          }
        },
        {
          key: 'city',
          type: 'input',
          props: {
            label: this.t(
              'CUSTOMERS.ADD.FORM.CITY'
            ), required: true
          }
        },
        {
          key: 'postalCode',
          type: 'input',
          props: {
            label: this.t(
              'CUSTOMERS.ADD.FORM.POSTAL_CODE'
            ), required: true
          }
        },
        {
          key: 'line1',
          type: 'input',
          props: {
            label: this.t(
              'CUSTOMERS.ADD.FORM.LINE1'
            ), required: true
          }
        }
      ],
    },
    {
      key: 'kycStatus',
      type: 'selectbox',
      expressions: { hide: () => this.mode !== 'update' },
      props: {
        label: this.t('CUSTOMERS.EDIT.FORM.KYC_STATUS'),
        required: true,
        options: [
          { value: 'UNKNOWN', label: 'UNKNOWN' },
          { value: 'PENDING', label: 'PENDING' },
          { value: 'APPROVED', label: 'APPROVED' },
          { value: 'REJECTED', label: 'REJECTED' },
        ],
      },
    },
    {
      key: 'isActive',
      type: 'checkbox',
      expressions: { hide: () => this.mode !== 'update' },
      props: {
        label: this.t('CUSTOMERS.EDIT.FORM.IS_ACTIVE'),
      },
    }
  ];

  ngOnInit() {
    if (this.mode === 'update' && this.data.customer) {
      const customer = this.data.customer;

      this.model = {
        name: customer.name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        dateOfBirth: (customer.dateOfBirth ?? '').slice(0, 10),
        nationalId: (customer.nationalId ?? null) as any,
        address: {
          country: customer.address?.country ?? '',
          city: customer.address?.city ?? '',
          postalCode: customer.address?.postalCode ?? '',
          line1: customer.address?.line1 ?? '',
        },
        ...(this.data.initial ?? {}),
      };
    } else {
      this.model = {
        address: {
          country: '',
          city: '',
          postalCode: '',
          line1: ''
        },
        ...(this.data.initial ?? {}),
      };
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    this.errorMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const body =
      this.mode === 'create'
        ? (raw as CreateCustomerRequest)
        : (raw as UpdateCustomerRequest);

    this.submitting = true;

    const request$ =
      this.mode === 'create'
        ? this.customerService.createCustomer(body as CreateCustomerRequest)
        : this.customerService.updateCustomer(this.customerId!, body as UpdateCustomerRequest);

    request$
      .pipe(
        catchError((err) => {
          this.errorMsg = String(
            err?.error?.message || err?.message || this.t('COMMON.ERROR_GENERIC')
          );
          return throwError(() => err);
        }),
        finalize(() => (this.submitting = false))
      )
      .subscribe({
        next: (customer) => {
          this.dialogRef.close(customer);
        }
      });
  }
}
