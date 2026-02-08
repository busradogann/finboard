export interface CustomersQueryRequest {
	page: number;
	pageSize: number;
	search?: string;
	kycStatus?: KycStatus;
	isActive?: boolean;
}

export enum KycStatus {
	Unknown = 'UNKNOWN',
	Unverified = 'UNVERIFIED',
	Verified = 'VERIFIED',
	Contracted = 'CONTRACTED'
}

export interface CreateCustomerRequest {
	name: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	nationalId: number;
	address: Address;
}

export interface Address {
	country: string;
	city: string;
	postalCode: string;
	line1: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
	name: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	nationalId: number;
	address: Address;
	kycStatus: KycStatus;
	isActive: boolean;
}

export interface CustomerDetailsRequest {
	id: string;
}