import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { catchError, map, shareReplay, startWith, switchMap } from "rxjs/operators";

import { Wallet } from "../models/wallets/wallet.response.model";
import { WalletService } from "../services/wallet.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Dialog } from "@angular/cdk/dialog";
import { UpdateWalletModalComponent } from "./update-wallet-modal/update-wallet-modal.component";
import { CurrencySymbolPipe } from "../shared/pipes/currency-symbol.pipe";

type Vm =
  | { state: "loading"; customerId: string }
  | { state: "error"; customerId: string; message: string }
  | { state: "ready"; customerId: string; wallet: Wallet; currencySymbol: string };

@Component({
  selector: "app-wallets",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, CurrencySymbolPipe],
  templateUrl: "./wallets.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly walletService = inject(WalletService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly dialog = inject(Dialog);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly customerId$ = this.route.paramMap.pipe(
    map((pm) => (pm.get("customerId") ?? "").trim()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly vm$: Observable<Vm> = combineLatest([
    this.customerId$,
    this.refresh$,
  ]).pipe(
    switchMap(([customerId]) => {
      if (!customerId) {
        return of<Vm>({
          state: "error",
          customerId: "",
          message: "customerId missing (route param)",
        });
      }

      return this.walletService.getByCustomerId(customerId).pipe(
        map((wallet) => ({
          state: "ready" as const,
          customerId,
          wallet,
          currencySymbol: this.getCurrencySymbol(wallet.currency),
        })),
        startWith({ state: "loading" as const, customerId }),
        catchError((err) =>
          of<Vm>({
            state: "error",
            customerId,
            message: this.toErrorMessage(err),
          })
        )
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  refresh(): void {
    this.refresh$.next();
  }

  formatMoney(amount: number, currency: string): string {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  private getCurrencySymbol(currency: string): string {
    const map: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€" };
    return map[currency] ?? currency;
  }

  private toErrorMessage(err: any): string {
    return String(
      err?.error?.message ||
      err?.message ||
      this.translate.instant("WALLETS.WALLET_ERROR_MESSAGE")
    );
  }

  openUpdateWalletModal(wallet: Wallet): void {
    const ref = this.dialog.open<Wallet>(UpdateWalletModalComponent, {
      width: '420px',
      maxWidth: '92vw',
      hasBackdrop: true,
      disableClose: false,

      data: {
        customerId: this.route.snapshot.paramMap.get("customerId")!,
        wallet,
      },
    });

    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedWallet) => {
      if (updatedWallet) {
        this.refresh();
      }
    });
  }
}
