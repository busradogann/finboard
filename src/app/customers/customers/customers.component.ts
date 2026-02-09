import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

import { CustomerService } from '../../services/customer.service';
import { PagedResponse } from '../../models/customers/customers.page.model';
import { Customer } from '../../models/customers/customers.response.model';
import { KycStatus } from '../../models/customers/customers.request.model';
import { Router } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerFormDialogComponent } from '../create-update-customer-dialog/create-update-customer-dialog.component';
import { AlertService } from '../../services/alert.service';
import { CustomerDetailModalComponent } from '../customer-detail-modal/customer-detail-modal.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkMenuModule, TranslateModule],
  templateUrl: './customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {
  search = '';
  kycStatus: KycStatus | '' = '';
  isActive: '' | 'true' | 'false' = '';
  pageSize = 10;
  openMenuFor: string | null = null;

  customers$: Observable<PagedResponse<Customer>>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: Dialog,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.customers$ = this.customerService.customers$;
    this.loading$ = this.customerService.loading$;
    this.error$ = this.customerService.error$;
    this.customerService.setQuery({ page: 1, pageSize: this.pageSize });
  }

  onSearchChange(value: string) {
    this.search = value;
    this.customerService.setQuery({ search: value, page: 1 });
  }

  onKycChange(value: string) {
    this.kycStatus = value as any;
    this.customerService.setQuery({
      kycStatus: value ? (value as KycStatus) : undefined,
      page: 1,
    });
  }

  onActiveChange(value: string) {
    this.isActive = value as any;
    this.customerService.setQuery({
      isActive: value === '' ? undefined : value === 'true',
      page: 1,
    });
  }

  onPageSizeChange(value: string) {
    const size = Number(value);
    this.pageSize = size;
    this.customerService.setQuery({ pageSize: size, page: 1 });
  }

  nextPage(res: PagedResponse<Customer>) {
    const next = res.page + 1;
    const maxPage = Math.ceil(res.total / res.pageSize);
    if (next <= maxPage) this.customerService.setQuery({ page: next });
  }

  prevPage(res: PagedResponse<Customer>) {
    const prev = res.page - 1;
    if (prev >= 1) this.customerService.setQuery({ page: prev });
  }

  trackByCustomerId(_index: number, customer: Customer): string {
    return customer.id;
  }

  toggleMenu(customerId: string, ev: MouseEvent) {
    ev.stopPropagation();
    this.openMenuFor = this.openMenuFor === customerId ? null : customerId;
  }

  private closeMenu() {
    this.openMenuFor = null;
  }

  goToWallets(customerId: string) {
    this.closeMenu();
    this.router.navigateByUrl(`/customer/${customerId}/wallets`);
  }

  goToTransactions(customerId: string) {
    this.closeMenu();
    this.router.navigateByUrl(`/customer/${customerId}/transactions`);
  }

  openCreateCustomerDialog(): void {
    const ref = this.dialog.open(CustomerFormDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: { mode: 'create' },
    });

    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result) return;
      this.refreshCustomers();
    });
  }

  refreshCustomers(): void {
    this.customerService.setQuery({});
  }

  openEditCustomerDialog(customer: Customer): void {
    this.closeMenu();
    const ref = this.dialog.open(CustomerFormDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: { mode: 'update', customer },
    });

    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (!result) return;
      this.refreshCustomers();
    });
  }

  deleteCustomer(customerId: string): void {
    const ok = confirm(
      this.translateService.instant('CUSTOMERS.CONFIRM_DELETE')
    );
    if (!ok) return;

    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        this.alertService.success(
          this.translateService.instant('CUSTOMERS.DELETE_SUCCESS')
        );
      },
      error: () => {
        this.alertService.error(
          this.translateService.instant('COMMON.ERROR_GENERIC')
        );
      },
    });
  }

  openCustomerDetails(id: string) {
    this.dialog.open(CustomerDetailModalComponent, {
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      data: { id },
    });
  }

  stop(e: MouseEvent) {
    e.stopPropagation();
  }
}

