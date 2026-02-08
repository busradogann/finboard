import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  private translateService = inject(TranslateService);
  constructor(
    public lang: LanguageService,
    public theme: ThemeService
  ) {
    this.theme.init();
  }

  onLangChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'tr' || value === 'en') {
      this.lang.set(value as Lang);
      localStorage.setItem('lang', value);
      this.translateService.use(value);
    }
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
