export type TransactionType = "DEBIT" | "CREDIT";
export type TransferDirection = "INCOMING" | "OUTGOING";

export interface TransactionsQuery {
	page?: number;
	pageSize?: number;
	type?: TransactionType;
	transferDirection?: TransferDirection;
	currency?: string;
	from?: string;
	to?: string;
}