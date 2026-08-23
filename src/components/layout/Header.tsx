"use client";

import { Menu, Bell, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm font-medium text-slate-100">
            CRM Dashboard
          </p>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your customers and relationships
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search"
          className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white sm:block"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="ml-1 flex items-center gap-3 border-l border-slate-800 pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-200">
              Admin User
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
            A
          </div>
        </div>
      </div>
    </header>
  );
}