import { KycStatus } from "./customers.request.model";

export interface Customer {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletNumber: string;
	dateOfBirth: string;
	nationalId: number;
	address: Address;
	kycStatus: KycStatus;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Address {
	country: string;
	city: string;
	postalCode: string;
	line1: string;
}

export interface CustomerResponse {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletNumber: string;
	dateOfBirth: string;
	nationalId: number;
	address: Address;
	kycStatus: KycStatus;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CustomerDetailResponse {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletNumber: string;
	nationalId: number;
	dateOfBirth: string;
	address: Address;
	kycStatus: KycStatus;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}