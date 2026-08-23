"use client";

import {
  useMemo,
  useState,
} from "react";

import CustomerTable from "@/components/customers/CustomerTable";
import { useCustomers } from "@/hooks/useCustomers";

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

  const [searchQuery, setSearchQuery] = useState("");

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredAndSortedCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = customers.filter((customer) => {
      if (!query) {
        return true;
      }

      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      }

      if (sortField === "email") {
        comparison = a.email.localeCompare(b.email);
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
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAndSortedCustomers.length / pageSize,
    ),
  );

  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

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
      Math.min(Math.max(page, 1), totalPages),
    );
  };

  const handlePageSizeChange = (
    newPageSize: number,
  ) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <main className="space-y-5 p-4 sm:space-y-6 sm:p-6">
      <div>
      <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Customers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and keep track of your customers.
        </p>
      </div>

        {isLoading && (
        <div
            className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
            aria-label="Loading customers"
        >
            <div className="animate-pulse">
            <div className="border-b border-slate-700 bg-slate-800 px-5 py-4">
                <div className="h-4 w-32 rounded bg-slate-700" />
            </div>

            {Array.from({ length: 6 }).map((_, index) => (
                <div
                key={index}
                className="flex items-center gap-4 border-b border-slate-800 px-5 py-4 last:border-b-0"
                >
                <div className="h-4 w-32 rounded bg-slate-800" />
                <div className="h-4 w-48 rounded bg-slate-800" />
                <div className="hidden h-4 w-28 rounded bg-slate-800 sm:block" />
                <div className="hidden h-4 w-24 rounded bg-slate-800 md:block" />
                </div>
            ))}
            </div>
        </div>
        )}

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

      {!isLoading && !isError && (
        <>
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
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or company..."
              className="h-11 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />

            {searchQuery.trim() && (
              <p className="mt-2 text-xs text-slate-400">
                Showing{" "}
                {filteredAndSortedCustomers.length} of{" "}
                {customers.length} customers
              </p>
            )}
          </div>

            {customers.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg text-slate-400">
                +
                </div>

                <h2 className="mt-4 text-base font-semibold text-white">
                No customers yet
                </h2>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-400">
                Your customer list is currently empty. Customers
                will appear here once they are added.
                </p>
            </div>
            ) : (
            <CustomerTable
                customers={paginatedCustomers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
            />
            )}

          {filteredAndSortedCustomers.length > 0 && (
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
                      Number(event.target.value),
                    )
                  }
                  className="h-9 rounded-md border border-slate-700 bg-slate-800 px-2 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-400">
                  Showing{" "}
                  {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(
                    currentPage * pageSize,
                    filteredAndSortedCustomers.length,
                  )}{" "}
                  of {filteredAndSortedCustomers.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="min-h-10 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
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
    </main>
  );
}