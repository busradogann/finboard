import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnInit,
  Inject,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { Wallet } from '../../models/wallets/wallet.response.model';
import { WalletService } from '../../services/wallet.service';
import { UpdateWalletRequest } from '../../models/wallets/wallets.request.model';

import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

type UpdateWalletModel = UpdateWalletRequest;

export interface UpdateWalletDialogData {
  customerId: string;
  wallet: Wallet;
}

@Component({
  selector: 'app-update-wallet-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormlyModule],
  templateUrl: './update-wallet-modal.component.html',
})
export class UpdateWalletModalComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() customerId!: string;
  @Input() wallet!: Wallet;

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Wallet>();

  private translateService = inject(TranslateService);

  submitting = false;
  apiError: string | null = null;

  form = new FormGroup({});
  model: UpdateWalletModel = { dailyLimit: 0, monthlyLimit: 0 };
  options: FormlyFormOptions = {};

  constructor(
    private walletService: WalletService,
    private dialogRef: DialogRef<Wallet>,
    @Inject(DIALOG_DATA) public data: UpdateWalletDialogData | null,
  ) {
    if (data) {
      this.customerId = data.customerId;
      this.wallet = data.wallet;
    }
  }

  private t(key: string) {
    return this.translateService.instant(key);
  }

  fields: FormlyFieldConfig[] = [
    {
      key: 'dailyLimit',
      type: 'input',
      props: {
        type: 'number',
        label: this.t('WALLET.TABLE.DAILY_LIMIT'),
        placeholder: this.t('WALLET.TABLE.DAILY_LIMIT'),
        required: true,
        min: 0,
      },
      validation: {
        messages: {
          required: this.t('COMMON.REQUIRED'),
          min: this.t('COMMON.MIN_VALUE'),
        },
      },
    },
    {
      key: 'monthlyLimit',
      type: 'input',
      props: {
        type: 'number',
        label: this.t('WALLET.TABLE.MONTHLY_LIMIT'),
        placeholder: this.t('WALLET.TABLE.MONTHLY_LIMIT'),
        required: true,
        min: 0,
      },
      validation: {
        messages: {
          required: this.t('COMMON.REQUIRED'),
          min: this.t('COMMON.MIN_VALUE'),
        },
      },
    },
  ];

  ngOnInit(): void {
    if (this.wallet) {
      this.setFormFromWallet(this.wallet);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const opened = changes['open']?.currentValue === true;
    const walletChanged = !!changes['wallet'] && !!this.wallet;

    if ((opened || walletChanged) && this.wallet) {
      this.setFormFromWallet(this.wallet);
    }
  }

  private setFormFromWallet(wallet: Wallet): void {
    this.apiError = null;

    this.model = {
      dailyLimit: wallet.dailyLimit ?? 0,
      monthlyLimit: wallet.monthlyLimit ?? 0,
    };

    queueMicrotask(() => {
      this.options.resetModel?.(this.model);
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  close(): void {
    if (this.submitting) return;

    this.dialogRef.close();
    this.closed.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.apiError = null;

    const req: UpdateWalletRequest = {
      dailyLimit: Number(this.model.dailyLimit),
      monthlyLimit: Number(this.model.monthlyLimit),
    };

    this.submitting = true;

    this.walletService
      .updateWallet(this.customerId, req)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (updatedWallet) => {
          this.dialogRef.close(updatedWallet);
          this.updated.emit(updatedWallet);
          this.closed.emit();
        },
        error: (err) => {
          this.apiError =
            err?.error?.message ||
            err?.message ||
            'Something went wrong while updating wallet.';
        },
      });
  }
}
