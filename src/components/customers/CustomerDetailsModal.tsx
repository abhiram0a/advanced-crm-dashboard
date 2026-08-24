"use client";

import {
  CalendarDays,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import type { Customer } from "@/types/customer";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusClasses(
  status: Customer["status"],
) {
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
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsModalProps) {
  if (!isOpen || !customer) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id="customer-details-title"
                  className="text-lg font-semibold text-white"
                >
                  {customer.name}
                </h2>

                <p className="text-sm text-slate-500">
                  {customer.id}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Mail className="h-4 w-4" />
                Email
              </div>

              <p className="mt-2 break-all text-sm text-slate-200">
                {customer.email}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Phone className="h-4 w-4" />
                Phone
              </div>

              <p className="mt-2 text-sm text-slate-200">
                {customer.phone}
              </p>
            </div>

            {/* Company */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Company
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {customer.company}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    customer.status,
                  )}`}
                >
                  {customer.status}
                </span>
              </div>
            </div>

            {/* Last Contact */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <CalendarDays className="h-4 w-4" />
                Last Contact
              </div>

              <p className="mt-2 text-sm text-slate-200">
                {formatDate(customer.lastContactDate)}
              </p>
            </div>

            {/* Notes */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {customer.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-700 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}