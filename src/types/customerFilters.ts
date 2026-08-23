export interface CustomerFilterState {
    statuses: Array<"Active" | "Inactive" | "Lead">;
    companies: string[];
    dateFrom: string;
    dateTo: string;
    phone: string;
    email: string;
  }
  
  export const emptyCustomerFilters: CustomerFilterState = {
    statuses: [],
    companies: [],
    dateFrom: "",
    dateTo: "",
    phone: "",
    email: "",
  };