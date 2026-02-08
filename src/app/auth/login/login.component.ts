import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

const MOCK_USER = {
  email: 'test@email.com',
  password: 'Test123!',
};

const AUTH_KEY = 'auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormlyModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = { email: '', password: '' };

  loading = false;
  error: string | null = null;

  fields: FormlyFieldConfig[] = [];

  private inputClass =
    'w-full rounded-xl border border-white/1 bg-white/5 px-4 py-2.5 ' +
    'text-slate-400 placeholder:text-slate-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40';

  ngOnInit(): void {
    this.buildFields();
    this.translate.onLangChange.subscribe(() => this.buildFields());
  }

  private t(key: string) {
    return this.translate.instant(key);
  }

  private buildFields(): void {
    this.fields = [
      {
        key: 'email',
        type: 'input',
        props: {
          type: 'email',
          label: this.t('AUTH.LOGIN.EMAIL_LABEL'),
          placeholder: this.t('AUTH.LOGIN.EMAIL_PLACEHOLDER'),
          required: true,
          attributes: { class: this.inputClass },
        },
        validators: { validation: [Validators.required, Validators.email] },
        validation: {
          messages: {
            required: () => this.t('AUTH.LOGIN.EMAIL_ERROR'),
            email: () => this.t('AUTH.LOGIN.EMAIL_ERROR'),
          },
        },
      },
      {
        key: 'password',
        type: 'input',
        props: {
          label: this.t('AUTH.LOGIN.PASSWORD_LABEL'),
          placeholder: this.t('AUTH.LOGIN.PASSWORD_PLACEHOLDER'),
          required: true,
          attributes: {
            type: 'password',
            class: this.inputClass,
          },
        },
        validators: { validation: [Validators.required] },
        validation: {
          messages: {
            required: () => this.t('AUTH.LOGIN.PASSWORD_ERROR'),
          },
        },
      }

    ];
  }

  submit(): void {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.model;

    this.loading = true;

    setTimeout(() => {
      this.loading = false;

      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ email, loggedInAt: new Date().toISOString() }),
        );

        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(redirect || '/customers');
      } else {
        this.error = this.t('AUTH.LOGIN.INVALID_CREDENTIALS');
      }
    }, 700);
  }
}
