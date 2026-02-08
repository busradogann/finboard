export interface TransactionResponse {
	page: number;
	pageSize: number;
	total: number;
	data: Transaction[];
}

export interface Transaction {
	id: string;
	customerId: string;
	type: "DEBIT" | "CREDIT";
	amount: number;
	currency: "TRY" | "USD" | "EUR";
	createdAt: string;
	description: string;
	transferDirection: "INCOMING" | "OUTGOING";
	merchantName: string;
	receiverName: string;
	receiverWalletNumber: string;
}
