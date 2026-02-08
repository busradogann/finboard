import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'tr' | 'en';
const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
	private readonly _lang$ = new BehaviorSubject<Lang>(this.read());

	lang$ = this._lang$.asObservable();

	get current(): Lang {
		return this._lang$.value;
	}

	set(lang: Lang) {
		localStorage.setItem(STORAGE_KEY, lang);
		this._lang$.next(lang);
	}

	private read(): Lang {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === 'en' || v === 'tr' ? v : 'tr';
	}
}
