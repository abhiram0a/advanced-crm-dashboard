"use client";

import type { Customer } from "@/types/customer";

type SortField = "name" | "email" | "lastContactDate";

type SortDirection = "asc" | "desc";

interface CustomerTableProps {
  customers: Customer[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function getStatusClasses(status: Customer["status"]) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Inactive":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "Lead":
      return "bg-blue-50 text-blue-700 border-blue-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
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
      className="inline-flex items-center gap-1 font-medium text-slate-500 transition hover:text-slate-900"
    >
      {label}

      <span
        aria-hidden="true"
        className={`text-xs ${
          isActive ? "text-slate-900" : "text-slate-300"
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
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h3 className="text-sm font-semibold text-slate-900">
          No customers found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left">
                <SortButton
                  field="name"
                  label="Name"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3 text-left">
                <SortButton
                  field="email"
                  label="Email"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-500">
                Phone
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-500">
                Company
              </th>

              <th className="px-5 py-3 text-left font-medium text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-left">
                <SortButton
                  field="lastContactDate"
                  label="Last Contact"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3 text-right font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {customer.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {customer.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {customer.email}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {customer.phone}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {customer.company}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      customer.status,
                    )}`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {formatDate(customer.lastContactDate)}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-700 hover:text-slate-950"
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