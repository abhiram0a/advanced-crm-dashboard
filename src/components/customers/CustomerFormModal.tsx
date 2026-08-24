"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/useCustomers";

import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/lib/customerValidation";

import type {
  Customer,
  CustomerStatus,
} from "@/types/customer";

interface CustomerFormModalProps {
  customer?: Customer | null;
  companies: string[];
  onClose: () => void;
}

function getInitialFormState(
  customer?: Customer | null,
): CustomerFormValues {
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
    status: "Lead" as CustomerStatus,
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

  const isSubmitting =
    createCustomerMutation.isPending ||
    updateCustomerMutation.isPending;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: getInitialFormState(customer),
    mode: "onTouched",
  });

  useEffect(() => {
    form.reset(getInitialFormState(customer));
  }, [customer, form]);

  const handleSubmit = async (
    values: CustomerFormValues,
  ) => {
    try {
      if (isEditMode && customer) {
        await updateCustomerMutation.mutateAsync({
          customerId: customer.id,
          input: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            company: values.company.trim(),
            status: values.status,
            lastContactDate:
              values.lastContactDate,
            notes: values.notes.trim(),
          },
        });

        toast.success("Customer updated successfully.");
      } else {
        await createCustomerMutation.mutateAsync({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          status: values.status,
          lastContactDate:
            values.lastContactDate,
          notes: values.notes.trim(),
        });

        toast.success("Customer added successfully.");
      }

      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update customer."
            : "Unable to create customer.";

      toast.error(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-form-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-h-[80vh] overflow-y-auto"
          >
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter customer name"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder="customer@example.com"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>

                    <FormControl>
                      <input
                        {...field}
                        type="tel"
                        placeholder="+1 555 000 0000"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>

                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        list="customer-company-options"
                        placeholder="Company name"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <datalist id="customer-company-options">
                      {companies.map((company) => (
                        <option
                          key={company}
                          value={company}
                        />
                      ))}
                    </datalist>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <FormControl>
                      <select
                        {...field}
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Contact */}
              <FormField
                control={form.control}
                name="lastContactDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Contact Date
                    </FormLabel>

                    <FormControl>
                      <input
                        {...field}
                        type="date"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Notes</FormLabel>

                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Add any useful notes about this customer..."
                        rows={4}
                        disabled={isSubmitting}
                        className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </div>
    </div>
  );
}