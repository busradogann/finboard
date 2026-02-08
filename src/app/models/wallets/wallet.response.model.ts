export interface Wallet {
	customerId: string;
	currency: CurrencyCode;
	balance: number;
	dailyLimit: number;
	monthlyLimit: number;
}

export type CurrencyCode = "TRY" | "USD" | "EUR" | string;
