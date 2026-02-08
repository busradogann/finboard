import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService, Lang } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


type NavItem = { label: string; to: string };

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private translateService = inject(TranslateService);

  nav: NavItem[] = [
    { label: 'Customers', to: '/customers' }
  ];

  constructor(
    public theme: ThemeService,
    public lang: LanguageService) {
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

  logout() {
    localStorage.removeItem('auth');
    window.location.href = '/auth/login';
  }
}
