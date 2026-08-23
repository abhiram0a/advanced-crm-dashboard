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
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Customers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and keep track of your customers.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
          Loading customers...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-medium text-red-800">
            Unable to load customers
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading customers."}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="rounded-xl border bg-white p-4">
            <label
              htmlFor="customer-search"
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            {searchQuery.trim() && (
              <p className="mt-2 text-xs text-slate-500">
                Showing{" "}
                {filteredAndSortedCustomers.length} of{" "}
                {customers.length} customers
              </p>
            )}
          </div>

          <CustomerTable
            customers={paginatedCustomers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {filteredAndSortedCustomers.length > 0 && (
            <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
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
                  className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
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
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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