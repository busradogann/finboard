import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
	id: number;
	type: AlertType;
	message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
	private counter = 0;
	private alertsSubject = new BehaviorSubject<Alert[]>([]);
	alerts$ = this.alertsSubject.asObservable();

	show(type: AlertType, message: string, duration = 3000) {
		const alert: Alert = {
			id: ++this.counter,
			type,
			message,
		};

		const alerts = [...this.alertsSubject.value, alert];
		this.alertsSubject.next(alerts);

		setTimeout(() => this.remove(alert.id), duration);
	}

	success(message: string) {
		this.show('success', message);
	}

	error(message: string) {
		this.show('error', message, 4000);
	}

	info(message: string) {
		this.show('info', message);
	}

	remove(id: number) {
		this.alertsSubject.next(
			this.alertsSubject.value.filter((a) => a.id !== id)
		);
	}
}
