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

      <div className="mt-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="text-sm text-slate-400">
          Dashboard overview will be implemented in the next section.
        </p>
      </div>
    </section>
  );
}