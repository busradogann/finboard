import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
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

  constructor(
    private customerService: CustomerService,
    private translate: TranslateService,
    private dialogRef: DialogRef<CustomerDetailModalComponent>
  ) {
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.error = null;
    this.customer = null;

    this.customerService
      .getCustomerDetail(this.data?.id!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: CustomerDetailResponse | null) => (this.customer = res),
        error: (err: { error: { message: any; }; }) => {
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
