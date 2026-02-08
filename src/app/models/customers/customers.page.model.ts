export interface PagedResponse<T> {
	page: number;
	pageSize: number;
	total: number;
	data: T[];
}

export interface ApiError {
	status: number;
	message: string;
	details?: unknown;
}