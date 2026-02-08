import { CustomerResponse } from '../../models/customers/customers.response.model';
import { CreateCustomerRequest } from '../../models/customers/customers.request.model';

export type CustomerDialogMode = 'create' | 'update';

export interface CustomerDialogData {
	mode: CustomerDialogMode;
	customer?: CustomerResponse;
	initial?: Partial<CreateCustomerRequest>;
}