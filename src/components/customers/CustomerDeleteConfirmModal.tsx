"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { useDeleteCustomer } from "@/hooks/useCustomers";

import type { Customer } from "@/types/customer";

interface CustomerDeleteConfirmModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function CustomerDeleteConfirmModal({
  customer,
  isOpen,
  onClose,
  onDeleted,
}: CustomerDeleteConfirmModalProps) {
  const deleteMutation =
    useDeleteCustomer();

  if (!isOpen || !customer) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(
        customer.id,
      );

      onDeleted();
    } catch {
      // Error is displayed below using mutation.error.
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-customer-title"
      aria-describedby="delete-customer-description"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/60 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="delete-customer-title"
                className="text-lg font-semibold text-white"
              >
                Delete Customer
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            aria-label="Close delete confirmation"
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p
            id="delete-customer-description"
            className="text-sm leading-6 text-slate-300"
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {customer.name}
            </span>
            ? All customer information will be
            removed from the current customer
            list.
          </p>

          {deleteMutation.isError && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2.5 text-sm text-red-300"
            >
              {deleteMutation.error instanceof
              Error
                ? deleteMutation.error.message
                : "Unable to delete customer."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-700 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}