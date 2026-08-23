export type CustomerStatus = "Active" | "Inactive" | "Lead";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
}