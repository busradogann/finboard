import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { SharedFormlyModule } from './app/shared/formly/wrappers/shared-formly.module';
import { provideHttpClient } from '@angular/common/http';

import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'tr',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
    importProvidersFrom(
      ReactiveFormsModule,
      FormlyModule.forRoot({
        validationMessages: [
          {
            name: 'required',
            message: () => {
              return inject(TranslateService).instant('VALIDATION.REQUIRED');
            },
          },
          {
            name: 'email',
            message: () => {
              return inject(TranslateService).instant('VALIDATION.EMAIL');
            },
          },
          {
            name: 'minlength',
            message: (err) => {
              return inject(TranslateService).instant('VALIDATION.MINLENGTH', { requiredLength: err?.requiredLength });
            },
          },
          {
            name: 'maxlength',
            message: (err) => {
              return inject(TranslateService).instant('VALIDATION.MAXLENGTH', { requiredLength: err?.requiredLength });
            },
          },
        ],
        types: [
          {
            name: 'input',
            defaultOptions: {
              props: {
                className: 'formly-input',
              },
            },
          },
        ],
      }),
      SharedFormlyModule
    ),
  ],
});
