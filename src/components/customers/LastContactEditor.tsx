"use client";

import { useState } from "react";
import { CalendarDays, Check, Loader2 } from "lucide-react";

import { useUpdateLastContact } from "@/hooks/useCustomers";

interface LastContactEditorProps {
  customerId: string;
  currentDate: string;
}

export default function LastContactEditor({
  customerId,
  currentDate,
}: LastContactEditorProps) {
  const updateMutation =
    useUpdateLastContact();

  const [date, setDate] =
    useState(currentDate);

  const [error, setError] =
    useState("");

  const hasChanges =
    date !== currentDate;

  const handleSave = async () => {
    if (!date) {
      setError(
        "Please select a last contact date.",
      );
      return;
    }

    setError("");

    try {
      await updateMutation.mutateAsync({
        customerId,
        lastContactDate: date,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update last contact date.",
      );
    }
  };

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            disabled={updateMutation.isPending}
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={
            !hasChanges ||
            updateMutation.isPending
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}

          {updateMutation.isPending
            ? "Saving..."
            : "Update"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 text-xs text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}