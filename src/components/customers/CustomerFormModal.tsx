"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/useCustomers";

import type {
  Customer,
  CustomerStatus,
} from "@/types/customer";

interface CustomerFormModalProps {
  customer?: Customer | null;
  companies: string[];
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
}

function getInitialFormState(
  customer?: Customer | null,
): FormState {
  if (customer) {
    return {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
      lastContactDate:
        customer.lastContactDate,
      notes: customer.notes,
    };
  }

  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    lastContactDate: "",
    notes: "",
  };
}

export default function CustomerFormModal({
  customer = null,
  companies,
  onClose,
}: CustomerFormModalProps) {
  const createCustomerMutation =
    useCreateCustomer();

  const updateCustomerMutation =
    useUpdateCustomer();

  const isEditMode = Boolean(customer);

  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(customer),
  );

  const [formError, setFormError] =
    useState("");

  const updateField = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!form.phone.trim()) {
      setFormError("Phone is required.");
      return;
    }

    if (!form.company.trim()) {
      setFormError("Company is required.");
      return;
    }

    if (!form.lastContactDate) {
      setFormError(
        "Last contact date is required.",
      );
      return;
    }

    try {
      if (isEditMode && customer) {
        await updateCustomerMutation.mutateAsync({
          customerId: customer.id,
          input: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            company: form.company.trim(),
            status: form.status,
            lastContactDate:
              form.lastContactDate,
            notes: form.notes.trim(),
          },
        });
      } else {
        await createCustomerMutation.mutateAsync({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          status: form.status,
          lastContactDate:
            form.lastContactDate,
          notes: form.notes.trim(),
        });
      }

      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update customer."
            : "Unable to create customer.",
      );
    }
  };

  const isSubmitting =
    createCustomerMutation.isPending ||
    updateCustomerMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-form-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          if (!isSubmitting) {
            onClose();
          }
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="customer-form-title"
              className="text-lg font-semibold text-white"
            >
              {isEditMode
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update the customer's information."
                : "Add a new customer to your CRM."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close customer form"
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto"
        >
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {/* Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="customer-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Name
              </label>

              <input
                id="customer-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Enter customer name"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="customer-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="customer-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="customer@example.com"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="customer-phone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Phone
              </label>

              <input
                id="customer-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                placeholder="+1 555 000 0000"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="customer-company"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Company
              </label>

              <input
                id="customer-company"
                type="text"
                list="customer-company-options"
                value={form.company}
                onChange={(event) =>
                  updateField(
                    "company",
                    event.target.value,
                  )
                }
                placeholder="Company name"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />

              <datalist id="customer-company-options">
                {companies.map((company) => (
                  <option
                    key={company}
                    value={company}
                  />
                ))}
              </datalist>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="customer-status"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Status
              </label>

              <select
                id="customer-status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Lead">
                  Lead
                </option>
              </select>
            </div>

            {/* Last Contact */}
            <div>
              <label
                htmlFor="customer-last-contact"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Last Contact Date
              </label>

              <input
                id="customer-last-contact"
                type="date"
                value={form.lastContactDate}
                onChange={(event) =>
                  updateField(
                    "lastContactDate",
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="customer-notes"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Notes
              </label>

              <textarea
                id="customer-notes"
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value,
                  )
                }
                placeholder="Add any useful notes about this customer..."
                rows={4}
                disabled={isSubmitting}
                className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Error */}
            {formError && (
              <div
                role="alert"
                className="sm:col-span-2 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2.5 text-sm text-red-300"
              >
                {formError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-slate-700 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}