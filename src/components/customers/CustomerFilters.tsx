"use client";

import {
    Check,
    ChevronDown,
    Filter,
    GripVertical,
    Save,
    Trash2,
    X,
  } from "lucide-react";

import { useState } from "react";

import type { CustomerFilterState } from "@/types/customerFilters";
import type { SavedFilter } from "@/types/savedFilters";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  
  import type {
    DragEndEvent,
  } from "@dnd-kit/core";
  
  import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";
  
  import { CSS } from "@dnd-kit/utilities";


  interface SortableSavedFilterProps {
    savedFilter: SavedFilter;
    onApply: (savedFilter: SavedFilter) => void;
    onDelete: (savedFilterId: string) => void;
  }
  
  function SortableSavedFilter({
    savedFilter,
    onApply,
    onDelete,
  }: SortableSavedFilterProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: savedFilter.id,
    });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 p-2 ${
          isDragging
            ? "z-10 border-blue-500/50 bg-slate-800 shadow-xl"
            : ""
        }`}
      >
        <button
          type="button"
          aria-label={`Reorder ${savedFilter.name}`}
          className="cursor-grab touch-none rounded-md p-2 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
  
        <button
          type="button"
          onClick={() => onApply(savedFilter)}
          className="flex-1 rounded-md px-2 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          {savedFilter.name}
        </button>
  
        {!savedFilter.isTemplate && (
          <button
            type="button"
            onClick={() => onDelete(savedFilter.id)}
            aria-label={`Delete ${savedFilter.name}`}
            className="rounded-md p-2 text-slate-600 transition hover:bg-red-950/40 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

interface CustomerFiltersProps {
    isOpen: boolean;
    filters: CustomerFilterState;
    companies: string[];
    activeFilterCount: number;
    savedFilters: SavedFilter[];
    onChange: (
      filters: CustomerFilterState,
    ) => void;
    onApply: () => void;
    onClear: () => void;
    onClose: () => void;
    onSave: (name: string) => void;
    onApplySavedFilter: (
      savedFilter: SavedFilter,
    ) => void;
    onDeleteSavedFilter: (
      savedFilterId: string,
    ) => void;
    onReorderSavedFilters: (
        activeId: string,
        overId: string,
      ) => void;
  }

  export default function CustomerFilters({
    isOpen,
    filters,
    companies,
    activeFilterCount,
    savedFilters,
    onChange,
    onApply,
    onClear,
    onClose,
    onSave,
    onApplySavedFilter,
    onDeleteSavedFilter,
    onReorderSavedFilters,
  }: CustomerFiltersProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [filterName, setFilterName] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 6,
          },
        }),
      );

    if (!isOpen) {
      return null;
    }

  const toggleStatus = (
    status: "Active" | "Inactive" | "Lead",
  ) => {
    const exists = filters.statuses.includes(status);

    onChange({
      ...filters,
      statuses: exists
        ? filters.statuses.filter(
            (item) => item !== status,
          )
        : [...filters.statuses, status],
    });
  };

  const toggleCompany = (company: string) => {
    const exists =
      filters.companies.includes(company);

    onChange({
      ...filters,
      companies: exists
        ? filters.companies.filter(
            (item) => item !== company,
          )
        : [...filters.companies, company],
    });
  };

  const handleDragEnd = (
    event: DragEndEvent,
  ) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) {
      return;
    }
  
    onReorderSavedFilters(
      String(active.id),
      String(over.id),
    );
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-black/60"
      />

      <aside
        aria-label="Customer filters"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-700 bg-slate-950 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-300" />

            <div>
              <h2 className="text-base font-semibold text-white">
                Filters
              </h2>

              {activeFilterCount > 0 && (
                <p className="text-xs text-slate-500">
                  {activeFilterCount} active filter
                  {activeFilterCount === 1
                    ? ""
                    : "s"}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Save current filter */}
        <div className="border-b border-slate-800 px-5 py-4">
        {!isSaving ? (
            <button
            type="button"
            onClick={() => {
                setFilterName("");
                setIsSaving(true);
            }}
            disabled={activeFilterCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
            <Save className="h-4 w-4" />
            Save Filter
            </button>
        ) : (
            <div className="space-y-3">
            <label
                htmlFor="saved-filter-name"
                className="block text-sm font-medium text-slate-200"
            >
                Filter name
            </label>

            <input
                id="saved-filter-name"
                type="text"
                value={filterName}
                onChange={(event) =>
                setFilterName(event.target.value)
                }
                placeholder="e.g. High-value prospects"
                autoFocus
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />

            <div className="flex gap-2">
                <button
                type="button"
                onClick={() => {
                    setFilterName("");
                    setIsSaving(false);
                }}
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                Cancel
                </button>

                <button
                type="button"
                disabled={!filterName.trim()}
                onClick={() => {
                    onSave(filterName.trim());
                    setFilterName("");
                    setIsSaving(false);
                }}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                Save
                </button>
            </div>
            </div>
        )}
        </div>

        {/* Filter content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-6">
            {/* Status */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">
                  Status
                </h3>

                {filters.statuses.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        statuses: [],
                      })
                    }
                    className="text-xs text-slate-500 transition hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(
                  ["Active", "Inactive", "Lead"] as const
                ).map((status) => {
                  const checked =
                    filters.statuses.includes(
                      status,
                    );

                  return (
                    <label
                      key={status}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleStatus(status)
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
                      />

                      <span className="text-sm text-slate-300">
                        {status}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Company */}
            <section>
              <h3 className="mb-3 text-sm font-medium text-slate-200">
                Company
              </h3>

              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-300 outline-none transition hover:border-slate-600 [&::-webkit-details-marker]:hidden">
                  <span>
                    {filters.companies.length ===
                    0
                      ? "All companies"
                      : `${filters.companies.length} selected`}
                  </span>

                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>

                <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-2">
                  {companies.map((company) => {
                    const checked =
                      filters.companies.includes(
                        company,
                      );

                    return (
                      <label
                        key={company}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCompany(company)
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
                        />

                        <span className="text-sm text-slate-300">
                          {company}
                        </span>

                        {checked && (
                          <Check className="ml-auto h-4 w-4 text-blue-400" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </details>

              {filters.companies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.companies.map(
                    (company) => (
                      <span
                        key={company}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {company}

                        <button
                          type="button"
                          onClick={() =>
                            toggleCompany(
                              company,
                            )
                          }
                          aria-label={`Remove ${company}`}
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* Date range */}
            <section>
              <h3 className="mb-3 text-sm font-medium text-slate-200">
                Date Range (Last Contact)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="filter-date-from"
                    className="mb-1.5 block text-xs text-slate-500"
                  >
                    From
                  </label>

                  <input
                    id="filter-date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(event) =>
                      onChange({
                        ...filters,
                        dateFrom:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-300 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="filter-date-to"
                    className="mb-1.5 block text-xs text-slate-500"
                  >
                    To
                  </label>

                  <input
                    id="filter-date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(event) =>
                      onChange({
                        ...filters,
                        dateTo:
                          event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-300 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              </div>
            </section>

            {/* Phone */}
            <section>
              <label
                htmlFor="filter-phone"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Phone Number
              </label>

              <input
                id="filter-phone"
                type="search"
                value={filters.phone}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    phone: event.target.value,
                  })
                }
                placeholder="Search phone number..."
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </section>

            {/* Email */}
            <section>
              <label
                htmlFor="filter-email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email Contains
              </label>

              <input
                id="filter-email"
                type="search"
                value={filters.email}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    email: event.target.value,
                  })
                }
                placeholder="Search email..."
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              />
            </section>

            {/* Saved filters */}
            {savedFilters.length > 0 && (
            <section>
                <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-slate-200">
                    Saved Filters
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                    Drag to reorder
                    </p>
                </div>
                </div>

                <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                >
                <SortableContext
                    items={savedFilters.map(
                    (savedFilter) => savedFilter.id,
                    )}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                    {savedFilters.map((savedFilter) => (
                        <SortableSavedFilter
                        key={savedFilter.id}
                        savedFilter={savedFilter}
                        onApply={onApplySavedFilter}
                        onDelete={onDeleteSavedFilter}
                        />
                    ))}
                    </div>
                </SortableContext>
                </DndContext>
            </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950 px-5 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClear}
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={onApply}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}