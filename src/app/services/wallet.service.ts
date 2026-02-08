import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Wallet } from "../models/wallets/wallet.response.model";
import { environment } from "../../environment/environment";
import { UpdateWalletRequest } from "../models/wallets/wallets.request.model";

@Injectable({ providedIn: "root" })
export class WalletService {
	private readonly baseUrl = environment.apiBaseUrl;

	constructor(
		private readonly http: HttpClient
	) { }

	getByCustomerId(customerId: string): Observable<Wallet> {
		return this.http.get<Wallet>(
			`${this.baseUrl}/api/wallets/${encodeURIComponent(customerId)}`
		);
	}

	updateWallet(
		customerId: string,
		request: UpdateWalletRequest
	): Observable<Wallet> {
		return this.http.put<Wallet>(
			`${this.baseUrl}/api/wallets/${encodeURIComponent(customerId)}`,
			request
		);
	}
}
