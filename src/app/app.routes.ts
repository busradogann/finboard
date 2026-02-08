import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { LoginComponent } from './auth/login/login.component';
import { CustomersComponent } from './customers/customers/customers.component';

import { WalletsComponent } from './wallets/wallets.component';
import { TransactionsComponent } from './transactions/transactions.component';

import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		component: AuthLayoutComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
		],
	},
	{
		path: '',
		component: MainLayoutComponent,
		canActivateChild: [authGuard],
		children: [
			{ path: 'customers', component: CustomersComponent },
			{ path: 'customer/:customerId/wallets', component: WalletsComponent },
			{ path: 'customer/:customerId/transactions', component: TransactionsComponent },
			{ path: '', redirectTo: 'customers', pathMatch: 'full' },
		],
	},
	{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: '**', redirectTo: 'auth/login' },
];
