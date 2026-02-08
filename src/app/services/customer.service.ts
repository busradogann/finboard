import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
	BehaviorSubject,
	Observable,
	catchError,
	debounceTime,
	distinctUntilChanged,
	finalize,
	map,
	of,
	retryWhen,
	scan,
	shareReplay,
	switchMap,
	tap,
	timer,
} from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiError, PagedResponse } from '../models/customers/customers.page.model';
import { CreateCustomerRequest, CustomersQueryRequest } from '../models/customers/customers.request.model';
import { Customer, CustomerDetailResponse, CustomerResponse } from '../models/customers/customers.response.model';

const DEFAULT_QUERY: CustomersQueryRequest = { page: 1, pageSize: 10 };

@Injectable({ providedIn: 'root' })
export class CustomerService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = environment.apiBaseUrl;

	private readonly query$ = new BehaviorSubject<CustomersQueryRequest>(DEFAULT_QUERY);
	private readonly loadingSubject = new BehaviorSubject<boolean>(false);
	private readonly errorSubject = new BehaviorSubject<ApiError | null>(null);

	/** UI binding */
	loading$ = this.loadingSubject.asObservable();
	error$ = this.errorSubject.asObservable();

	/** Main stream: query değişince iptal + yenile */
	customers$: Observable<PagedResponse<Customer>> = this.query$.pipe(
		debounceTime(250),
		distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
		tap(() => {
			this.errorSubject.next(null);
			this.loadingSubject.next(true);
		}),
		switchMap((q) =>
			this.fetchCustomers(q).pipe(
				catchError((err) => {
					const apiErr = this.toApiError(err);
					this.errorSubject.next(apiErr);

					return of<PagedResponse<Customer>>({
						page: q.page,
						pageSize: q.pageSize,
						total: 0,
						data: [],
					});
				}),
				finalize(() => this.loadingSubject.next(false))
			)
		),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	setQuery(partial: Partial<CustomersQueryRequest>) {
		this.query$.next({ ...this.query$.value, ...partial });
	}

	resetQuery() {
		this.query$.next(DEFAULT_QUERY);
	}

	private fetchCustomers(req: CustomersQueryRequest): Observable<PagedResponse<Customer>> {
		let params = new HttpParams()
			.set('page', String(req.page))
			.set('pageSize', String(req.pageSize));

		if (req.search?.trim()) params = params.set('search', req.search.trim());
		if (req.kycStatus) params = params.set('kycStatus', req.kycStatus);
		if (typeof req.isActive === 'boolean') params = params.set('isActive', String(req.isActive));

		return this.http
			.get<PagedResponse<Customer>>(`${this.baseUrl}/api/customers`, { params })
			.pipe(
				retryWhen((errors) =>
					errors.pipe(
						scan((state, err: unknown) => {
							const apiErr = this.toApiError(err);
							const shouldRetry = apiErr.status === 0 || apiErr.status >= 500;
							if (!shouldRetry) throw err;

							const attempt = state + 1;
							if (attempt > 3) throw err;
							return attempt;
						}, 0),
						switchMap((attempt) => timer(300 * Math.pow(2, attempt)))
					)
				),
				map((res) => ({
					page: res.page,
					pageSize: res.pageSize,
					total: res.total,
					data: res.data ?? [],
				}))
			);
	}

	private toApiError(err: unknown): ApiError {
		if (err instanceof HttpErrorResponse) {
			const message =
				(typeof err.error === 'string' && err.error) ||
				err.error?.message ||
				err.message ||
				'Unexpected error';
			return { status: err.status || 0, message, details: err.error };
		}
		return { status: 0, message: 'Unexpected error', details: err };
	}

	createCustomer(body: CreateCustomerRequest): Observable<CustomerResponse> {
		return this.http.post<CustomerResponse>(`${this.baseUrl}/api/customers`, body);
	}

	getCustomerById(customerId: string): Observable<CustomerResponse> {
		return this.http.get<CustomerResponse>(`${this.baseUrl}/api/customers/${encodeURIComponent(customerId)}`);
	}

	updateCustomer(customerId: string, body: CreateCustomerRequest): Observable<CustomerResponse> {
		return this.http.put<CustomerResponse>(`${this.baseUrl}/api/customers/${encodeURIComponent(customerId)}`, body);
	}

	deleteCustomer(customerId: string): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/api/customers/${encodeURIComponent(customerId)}`);
	}

	getCustomerDetail(id: string): Observable<CustomerDetailResponse> {
		return this.http.get<CustomerDetailResponse>(`${this.baseUrl}/api/customers/${encodeURIComponent(id)}`);
	}

	refresh(): void {
		this.query$.next({ ...this.query$.value });
	}
}
