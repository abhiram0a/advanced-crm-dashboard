"use client";

import { useMemo, useState } from "react";

import CustomerTable from "@/components/customers/CustomerTable";
import { useCustomers } from "@/hooks/useCustomers";

type SortField = "name" | "email" | "lastContactDate";

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );

      return;
    }

    setSortField(field);
    setSortDirection("asc");
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
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
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
            customers={filteredAndSortedCustomers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </>
      )}
    </main>
  );
}