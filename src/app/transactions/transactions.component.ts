import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { TransactionsService } from '../services/transaction.service';
import { TransactionsQuery } from '../models/transactions/transactions.request.model';
import { TransactionResponse, Transaction } from '../models/transactions/transactions.response.model';

type Vm =
  | { state: 'loading'; customerId: string }
  | { state: 'error'; customerId: string; message: string }
  | { state: 'ready'; customerId: string; res: TransactionResponse };

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly transactionsService = inject(TransactionsService);

  readonly customerId$ = this.route.paramMap.pipe(
    map((pm) => (pm.get('customerId') ?? '').trim()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  search = '';
  type: TransactionsQuery['type'] | '' = '';
  transferDirection: TransactionsQuery['transferDirection'] | '' = '';
  currency: TransactionsQuery['currency'] | '' = '';
  from: string = '';
  to: string = '';
  pageSize = 10;

  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly query$ = new BehaviorSubject<TransactionsQuery>({
    page: 1,
    pageSize: 10,
  });

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly vm$: Observable<Vm> = combineLatest([
    this.customerId$,
    this.query$,
    this.refresh$,
  ]).pipe(
    switchMap(([customerId, query]) => {
      if (!customerId) {
        return of<Vm>({
          state: 'error',
          customerId: '',
          message: 'customerId missing',
        });
      }

      return this.transactionsService.getByCustomerId(customerId, query).pipe(
        map((res) => ({ state: 'ready' as const, customerId, res })),
        startWith({ state: 'loading' as const, customerId }),
        catchError((err) =>
          of<Vm>({
            state: 'error',
            customerId,
            message: this.toErrorMessage(err),
          })
        )
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  onTypeChange(v: string) {
    this.type = v as any;
    this.applyQuery();
  }

  onDirectionChange(v: string) {
    this.transferDirection = v as any;
    this.applyQuery();
  }

  onCurrencyChange(v: string) {
    this.currency = v as any;
    this.applyQuery();
  }

  onFromChange(v: string) {
    this.from = v;
    this.applyQuery();
  }

  onToChange(v: string) {
    this.to = v;
    this.applyQuery();
  }

  onPageSizeChange(v: number) {
    this.pageSize = Number(v);
    this.page$.next(1);
    this.applyQuery();
  }

  refresh(): void {
    this.refresh$.next();
  }

  prevPage(res: TransactionResponse) {
    const next = Math.max(1, res.page - 1);
    this.page$.next(next);
    this.applyQuery();
  }

  nextPage(res: TransactionResponse) {
    const totalPages = Math.max(1, Math.ceil(res.total / res.pageSize));
    const next = Math.min(totalPages, res.page + 1);
    this.page$.next(next);
    this.applyQuery();
  }

  private applyQuery() {
    const page = this.page$.value;
    const q: TransactionsQuery = {
      page,
      pageSize: this.pageSize,
      type: this.type || undefined,
      transferDirection: this.transferDirection || undefined,
      currency: this.currency || undefined,
      from: this.from || undefined,
      to: this.to || undefined,
    };
    this.query$.next(q);
  }

  trackByTransactionId(_index: number, t: { id: string }): string {
    return t.id;
  }

  formatMoney(amount: number, currency: string): string {
    try {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat('tr-TR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  private toErrorMessage(err: any): string {
    return String(err?.error?.message || err?.message || 'Transactions alınırken hata oluştu.');
  }
}
