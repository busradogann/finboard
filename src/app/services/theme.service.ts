import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	current: Theme = 'light';

	init() {
		const stored = localStorage.getItem(THEME_KEY) as Theme | null;
		const theme: Theme = stored === 'dark' ? 'dark' : 'light';
		this.apply(theme);
	}

	toggle() {
		const next: Theme = this.current === 'dark' ? 'light' : 'dark';
		this.apply(next);
	}

	set(theme: Theme) {
		this.apply(theme);
	}

	private apply(theme: Theme) {
		this.current = theme;
		localStorage.setItem(THEME_KEY, theme);
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}
}
