import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm text-slate-500">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Welcome to your CRM workspace.
        </p>
      </div>

      <DashboardOverview />
    </section>
  );
}