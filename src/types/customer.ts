import type { ShippingAddress } from "./order";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
}

export interface AuthSession {
  customer: Customer;
  addresses: ShippingAddress[];
}

export interface RegisterInput {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
