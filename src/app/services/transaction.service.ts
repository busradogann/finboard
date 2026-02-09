import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TransactionsQuery } from "../models/transactions/transactions.request.model";
import { TransactionResponse } from "../models/transactions/transactions.response.model";
import { environment } from "../../environment/environment";


@Injectable({ providedIn: "root" })
export class TransactionsService {
	private readonly baseUrl = environment.apiBaseUrl;

	constructor(private readonly http: HttpClient) { }

	getByCustomerId(
		customerId: string,
		query: TransactionsQuery = {}
	): Observable<TransactionResponse> {
		const params = this.toHttpParams(query);
		return this.http.get<TransactionResponse>(
			`${this.baseUrl}/api/transactions/${encodeURIComponent(customerId)}`,
			{ params }
		);
	}

	private toHttpParams(query: TransactionsQuery): HttpParams {
		let params = new HttpParams();

		const append = (key: keyof TransactionsQuery) => {
			const value = query[key];
			if (value === undefined || value === null || value === "") return;
			params = params.set(String(key), String(value));
		};

		append("page");
		append("pageSize");
		append("type");
		append("transferDirection");
		append("currency");
		append("from");
		append("to");

		return params;
	}
}
