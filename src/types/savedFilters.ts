import type { CustomerFilterState } from "@/types/customerFilters";

export interface SavedFilter {
  id: string;
  name: string;
  filters: CustomerFilterState;
  isTemplate?: boolean;
}