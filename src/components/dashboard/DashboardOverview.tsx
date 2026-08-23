import {
    PhoneCall,
    TrendingUp,
    Users,
    UserRoundCheck,
    TrendingDown,
  } from "lucide-react";
  
  import {
    Card,
    CardContent,
  } from "@/components/ui/card";
  
  const dashboardStats = [
    {
      title: "Total Customers",
      value: "14,782",
      trend: "+3.2%",
      trendLabel: "vs 7 days",
      icon: Users,
      trendDirection: "up",
      iconClassName: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Active Leads",
      value: "3,105",
      trend: "+6.8%",
      trendLabel: "vs 7 days",
      icon: UserRoundCheck,
      trendDirection: "up",
      iconClassName: "bg-orange-500/10 text-orange-400",
    },
    {
      title: "Contacted This Week",
      value: "947",
      trend: "-1.5%",
      trendLabel: "vs 7 days",
      icon: PhoneCall,
      trendDirection: "down",
      iconClassName: "bg-rose-500/10 text-rose-400",
    },
  ] as const;
  
  export function DashboardOverview() {
    return (
      <section className="mt-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
  
            const isPositive = stat.trendDirection === "up";
  
            return (
              <Card
                key={stat.title}
                className="border-slate-800 bg-slate-900/80"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
  
                    <div className="min-w-0">
                      <p className="text-2xl font-semibold tracking-tight text-white">
                        {stat.value}
                      </p>
  
                      <p className="mt-1 text-sm text-slate-400">
                        {stat.title}
                      </p>
  
                      <div className="mt-3 flex items-center gap-1.5 text-xs">
                        {isPositive ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                        )}
  
                        <span
                          className={
                            isPositive
                              ? "font-medium text-emerald-400"
                              : "font-medium text-rose-400"
                          }
                        >
                          {stat.trend}
                        </span>
  
                        <span className="text-slate-500">
                          {stat.trendLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    );
  }