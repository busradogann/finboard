import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    const storedLang = localStorage.getItem('lang');
    const lang = storedLang === 'tr' ? 'tr' : 'en';

    this.translate.addLangs(['tr', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }
}
