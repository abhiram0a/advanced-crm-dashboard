"use client";

import type { Customer } from "@/types/customer";

type SortField = "name" | "email" | "lastContactDate";

type SortDirection = "asc" | "desc";

interface CustomerTableProps {
  customers: Customer[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onViewCustomer: (customer: Customer) => void;
}

function getStatusClasses(status: Customer["status"]) {
  switch (status) {
    case "Active":
      return "bg-emerald-600 text-white border-emerald-500";

    case "Inactive":
      return "bg-slate-600 text-white border-slate-500";

    case "Lead":
      return "bg-blue-600 text-white border-blue-500";

    default:
      return "bg-slate-600 text-white border-slate-500";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function SortButton({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = sortField === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-medium text-slate-300 transition hover:text-white"
    >
      {label}

      <span
        aria-hidden="true"
        className={`text-xs ${
          isActive ? "text-white" : "text-slate-500"
        }`}
      >
        {isActive
          ? sortDirection === "asc"
            ? "↑"
            : "↓"
          : "↕"}
      </span>
    </button>
  );
}

export default function CustomerTable({
  customers,
  sortField,
  sortDirection,
  onSort,
  onViewCustomer,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
        <h3 className="text-sm font-semibold text-white">
          No customers found
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="border-b border-slate-700 bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left sm:px-5">
                <SortButton
                  field="name"
                  label="Name"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-4 py-3 text-left sm:px-5">
                <SortButton
                  field="email"
                  label="Email"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-400">
                Phone
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-400">
                Company
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-400">
                Status
              </th>

              <th className="px-4 py-3 text-left sm:px-5">
                <SortButton
                  field="lastContactDate"
                  label="Last Contact"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3 text-right font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-slate-800/60"
              >
                <td className="px-4 py-4 sm:px-5">
                  <div>
                    <p className="font-medium text-slate-100">
                      {customer.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {customer.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {customer.email}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {customer.phone}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {customer.company}
                </td>

                <td className="px-4 py-4 sm:px-5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      customer.status,
                    )}`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {formatDate(customer.lastContactDate)}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewCustomer(customer)}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}