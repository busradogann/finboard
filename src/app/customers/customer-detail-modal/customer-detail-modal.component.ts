import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../services/customer.service';
import { CustomerDetailResponse } from '../../models/customers/customers.response.model';

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './customer-detail-modal.component.html',
})
export class CustomerDetailModalComponent {
  loading = true;
  error: string | null = null;
  customer: CustomerDetailResponse | null = null;
  private data = inject<{ id: string }>(DIALOG_DATA);
  private customerService = inject(CustomerService);
  private translate = inject(TranslateService);
  private dialogRef = inject(DialogRef<CustomerDetailModalComponent>);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.error = null;
    this.customer = null;

    this.customerService
      .getCustomerDetail(this.data?.id!)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: CustomerDetailResponse | null) => (this.customer = res),
        error: (err: { error: { message: string } }) => {
          this.error =
            err?.error?.message ?? this.translate.instant('CUSTOMERS.DETAIL.ERROR_MESSAGE');
        },
      });
  }

  close() {
    this.dialogRef.close();
  }

  retry() {
    this.fetch();
  }
}
