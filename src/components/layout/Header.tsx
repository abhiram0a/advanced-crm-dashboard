"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
      {/* Mobile navigation */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* User profile */}
      <div className="ml-auto flex items-center gap-3">
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
    </header>
  );
}