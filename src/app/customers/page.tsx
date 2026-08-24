"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Filter,
} from "lucide-react";

import CustomerDeleteConfirmModal from "@/components/customers/CustomerDeleteConfirmModal";
import CustomerDetailsModal from "@/components/customers/CustomerDetailsModal";
import CustomerFilters from "@/components/customers/CustomerFilters";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import CustomerTable from "@/components/customers/CustomerTable";
import { useCustomers } from "@/hooks/useCustomers";

import {
  emptyCustomerFilters,
  type CustomerFilterState,
} from "@/types/customerFilters";

import type { SavedFilter } from "@/types/savedFilters";
import type { Customer } from "@/types/customer";


type SortField =
  | "name"
  | "email"
  | "lastContactDate";

type SortDirection = "asc" | "desc";

export default function CustomersPage() {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useCustomers();

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  const [draftFilters, setDraftFilters] =
    useState<CustomerFilterState>(
      emptyCustomerFilters,
    );

  const [appliedFilters, setAppliedFilters] =
    useState<CustomerFilterState>(
      emptyCustomerFilters,
    );

    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);
  
    const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] =
        useState(false);

    const [isAddCustomerOpen, setIsAddCustomerOpen] =
        useState(false);    
    const [isEditCustomerOpen, setIsEditCustomerOpen] =
        useState(false);

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
        useState(false);

    const [savedFilters, setSavedFilters] =
    useState<SavedFilter[]>(() => {
      if (typeof window === "undefined") {
        return [];
      }
  
      try {
        const storedFilters =
          localStorage.getItem(
            "crm-saved-filters",
          );
  
        if (!storedFilters) {
          return [];
        }
  
        return JSON.parse(
          storedFilters,
        ) as SavedFilter[];
      } catch {
        return [];
      }
    });



      useEffect(() => {
        localStorage.setItem(
          "crm-saved-filters",
          JSON.stringify(savedFilters),
        );
      }, [savedFilters]);

      const filterTemplates = useMemo<SavedFilter[]>(
        () => {
          const latestContactDate =
            customers.reduce(
              (latest, customer) =>
                customer.lastContactDate >
                latest
                  ? customer.lastContactDate
                  : latest,
              "",
            );
      
          const recentStartDate = (() => {
            if (!latestContactDate) {
              return "";
            }
      
            const date = new Date(
              `${latestContactDate}T00:00:00`,
            );
      
            date.setDate(date.getDate() - 30);
      
            return date
              .toISOString()
              .split("T")[0];
          })();
      
          return [
            {
              id: "template-active-customers",
              name: "Active Customers",
              isTemplate: true,
              filters: {
                statuses: ["Active"],
                companies: [],
                dateFrom: "",
                dateTo: "",
                phone: "",
                email: "",
              },
            },
            {
              id: "template-recent-contacts",
              name: "Recent Contacts",
              isTemplate: true,
              filters: {
                statuses: [],
                companies: [],
                dateFrom: recentStartDate,
                dateTo: latestContactDate,
                phone: "",
                email: "",
              },
            },
            {
              id: "template-inactive-leads",
              name: "Inactive Leads",
              isTemplate: true,
              filters: {
                statuses: ["Inactive"],
                companies: [],
                dateFrom: "",
                dateTo: "",
                phone: "",
                email: "",
              },
            },
          ];
        },
        [customers],
      );

      const allSavedFilters = useMemo(
        () => [
          ...filterTemplates,
          ...savedFilters,
        ],
        [filterTemplates, savedFilters],
      );

  /*
   * Build the company list directly from the
   * currently loaded customer dataset.
   */
  const companies = useMemo(() => {
    return Array.from(
      new Set(
        customers.map(
          (customer) => customer.company,
        ),
      ),
    ).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [customers]);

  /*
   * Count individual active filter values.
   * This powers the badge beside the Filters button.
   */
  const activeFilterCount = useMemo(() => {
    return (
      appliedFilters.statuses.length +
      appliedFilters.companies.length +
      (appliedFilters.dateFrom ? 1 : 0) +
      (appliedFilters.dateTo ? 1 : 0) +
      (appliedFilters.phone.trim() ? 1 : 0) +
      (appliedFilters.email.trim() ? 1 : 0)
    );
  }, [appliedFilters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  /*
   * Search + advanced filters + sorting.
   */
  const filteredAndSortedCustomers = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    const phoneQuery =
      appliedFilters.phone
        .trim()
        .toLowerCase();

    const emailQuery =
      appliedFilters.email
        .trim()
        .toLowerCase();

    const filtered = customers.filter(
      (customer) => {
        /*
         * Existing global search.
         */
        const matchesSearch =
          !query ||
          customer.name
            .toLowerCase()
            .includes(query) ||
          customer.email
            .toLowerCase()
            .includes(query) ||
          customer.company
            .toLowerCase()
            .includes(query);

        if (!matchesSearch) {
          return false;
        }

        /*
         * Status filter.
         *
         * Empty selection means:
         * show every status.
         */
        const matchesStatus =
          appliedFilters.statuses.length ===
            0 ||
          appliedFilters.statuses.includes(
            customer.status as
              | "Active"
              | "Inactive"
              | "Lead",
          );

        if (!matchesStatus) {
          return false;
        }

        /*
         * Company multi-select.
         */
        const matchesCompany =
          appliedFilters.companies.length ===
            0 ||
          appliedFilters.companies.includes(
            customer.company,
          );

        if (!matchesCompany) {
          return false;
        }

        /*
         * Last contact date - starting date.
         */
        const matchesDateFrom =
          !appliedFilters.dateFrom ||
          customer.lastContactDate >=
            appliedFilters.dateFrom;

        if (!matchesDateFrom) {
          return false;
        }

        /*
         * Last contact date - ending date.
         */
        const matchesDateTo =
          !appliedFilters.dateTo ||
          customer.lastContactDate <=
            appliedFilters.dateTo;

        if (!matchesDateTo) {
          return false;
        }

        /*
         * Partial phone matching.
         */
        const matchesPhone =
          !phoneQuery ||
          customer.phone
            .toLowerCase()
            .includes(phoneQuery);

        if (!matchesPhone) {
          return false;
        }

        /*
         * Partial email matching.
         */
        const matchesEmail =
          !emailQuery ||
          customer.email
            .toLowerCase()
            .includes(emailQuery);

        if (!matchesEmail) {
          return false;
        }

        return true;
      },
    );

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(
          b.name,
        );
      }

      if (sortField === "email") {
        comparison = a.email.localeCompare(
          b.email,
        );
      }

      if (sortField === "lastContactDate") {
        comparison =
          a.lastContactDate.localeCompare(
            b.lastContactDate,
          );
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });
  }, [
    customers,
    searchQuery,
    appliedFilters,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAndSortedCustomers.length /
        pageSize,
    ),
  );

  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    return filteredAndSortedCustomers.slice(
      startIndex,
      endIndex,
    );
  }, [
    filteredAndSortedCustomers,
    currentPage,
    pageSize,
  ]);

  const goToPage = (page: number) => {
    setCurrentPage(
      Math.min(
        Math.max(page, 1),
        totalPages,
      ),
    );
  };

  const handlePageSizeChange = (
    newPageSize: number,
  ) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  /*
   * Apply the draft filter values to the
   * actual customer dataset.
   */

  const handleSaveFilter = (
    name: string,
  ) => {
    const newSavedFilter: SavedFilter = {
      id: `saved-${Date.now()}`,
      name,
      filters: {
        ...appliedFilters,
        statuses: [
          ...appliedFilters.statuses,
        ],
        companies: [
          ...appliedFilters.companies,
        ],
      },
    };
  
    setSavedFilters((current) => [
      ...current,
      newSavedFilter,
    ]);
  };

  const handleApplySavedFilter = (
    savedFilter: SavedFilter,
  ) => {
    const restoredFilters = {
      ...savedFilter.filters,
      statuses: [
        ...savedFilter.filters.statuses,
      ],
      companies: [
        ...savedFilter.filters.companies,
      ],
    };
  
    setDraftFilters(restoredFilters);
    setAppliedFilters(restoredFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleDeleteSavedFilter = (
    savedFilterId: string,
  ) => {
    setSavedFilters((current) =>
      current.filter(
        (savedFilter) =>
          savedFilter.id !==
          savedFilterId,
      ),
    );
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  /*
   * Clear both the currently applied filters
   * and the draft values inside the drawer.
   */
  const handleClearFilters = () => {
    setDraftFilters(emptyCustomerFilters);
    setAppliedFilters(emptyCustomerFilters);
    setCurrentPage(1);
  };

  /*
   * Open the drawer with the currently applied
   * values already filled in.
   */
  const handleOpenFilters = () => {
    setDraftFilters(appliedFilters);
    setIsFilterOpen(true);
  };

  const handleViewCustomer = (
    customer: Customer,
  ) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailsOpen(true);
  };

  const handleEditCustomer = (
    customer: Customer,
  ) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailsOpen(false);
    setIsEditCustomerOpen(true);
  };

  const handleDeleteCustomer = (
    customer: Customer,
  ) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailsOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleCustomerDeleted = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseEditCustomer = () => {
    setIsEditCustomerOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseCustomerDetails = () => {
    setIsCustomerDetailsOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <main className="space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Page heading */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and keep track of your
              customers.
            </p>
          </div>

            <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() =>
                setIsAddCustomerOpen(true)
                }
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
                <span
                aria-hidden="true"
                className="text-base leading-none"
                >
                +
                </span>

                <span>Add Customer</span>
            </button>

            <button
                type="button"
                onClick={handleOpenFilters}
                className="relative inline-flex shrink-0 items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
                <Filter className="h-4 w-4" />

                <span>Filters</span>

                {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                    {activeFilterCount}
                </span>
                )}
            </button>
            </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
          aria-label="Loading customers"
        >
          <div className="animate-pulse">
            <div className="border-b border-slate-700 bg-slate-800 px-5 py-4">
              <div className="h-4 w-32 rounded bg-slate-700" />
            </div>

            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-slate-800 px-5 py-4 last:border-b-0"
                >
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="h-4 w-48 rounded bg-slate-800" />
                  <div className="hidden h-4 w-28 rounded bg-slate-800 sm:block" />
                  <div className="hidden h-4 w-24 rounded bg-slate-800 md:block" />
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-900/60 bg-red-950/40 p-5"
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white"
              aria-hidden="true"
            >
              !
            </div>

            <div>
              <h2 className="font-medium text-red-300">
                Unable to load customers
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading customers."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {!isLoading && !isError && (
        <>
          {/* Search */}
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 sm:p-4">
            <label
              htmlFor="customer-search"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Search customers
            </label>

            <input
              id="customer-search"
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(
                  event.target.value,
                );
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or company..."
              className="h-11 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />

            {(searchQuery.trim() ||
              activeFilterCount > 0) && (
              <p className="mt-2 text-xs text-slate-400">
                Showing{" "}
                {
                  filteredAndSortedCustomers.length
                }{" "}
                of {customers.length} customers
              </p>
            )}
          </div>

          {/* Empty dataset */}
          {customers.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg text-slate-400">
                +
              </div>

              <h2 className="mt-4 text-base font-semibold text-white">
                No customers yet
              </h2>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-400">
                Your customer list is currently
                empty. Customers will appear here
                once they are added.
              </p>
            </div>
          ) : (
            <CustomerTable
              customers={paginatedCustomers}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onViewCustomer={handleViewCustomer}
            />
          )}

          {/* Pagination */}
          {filteredAndSortedCustomers.length >
            0 && (
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <label htmlFor="page-size">
                  Rows per page
                </label>

                <select
                  id="page-size"
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="h-9 rounded-md border border-slate-700 bg-slate-800 px-2 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                >
                  <option value={10}>
                    10
                  </option>

                  <option value={25}>
                    25
                  </option>

                  <option value={50}>
                    50
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-400">
                  Showing{" "}
                  {(currentPage - 1) *
                    pageSize +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * pageSize,
                    filteredAndSortedCustomers.length,
                  )}{" "}
                  of{" "}
                  {
                    filteredAndSortedCustomers.length
                  }
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage - 1,
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="min-h-10 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage + 1,
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="min-h-10 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Advanced filters drawer */}

        <CustomerFilters
        isOpen={isFilterOpen}
        filters={draftFilters}
        companies={companies}
        activeFilterCount={activeFilterCount}
        savedFilters={allSavedFilters}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={() =>
            setIsFilterOpen(false)
        }
        onSave={handleSaveFilter}
        onApplySavedFilter={
            handleApplySavedFilter
        }
        onDeleteSavedFilter={
            handleDeleteSavedFilter
        }
        />
        
        <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isCustomerDetailsOpen}
        onClose={handleCloseCustomerDetails}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        />

        {isAddCustomerOpen && (
        <CustomerFormModal
            companies={companies}
            onClose={() =>
            setIsAddCustomerOpen(false)
            }
        />
        )}

        {isEditCustomerOpen &&
        selectedCustomer && (
            <CustomerFormModal
            key={selectedCustomer.id}
            customer={selectedCustomer}
            companies={companies}
            onClose={handleCloseEditCustomer}
            />
        )}

        <CustomerDeleteConfirmModal
        customer={selectedCustomer}
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
            setIsDeleteConfirmOpen(false);
        }}
        onDeleted={handleCustomerDeleted}
        />
    </main>
  );
}