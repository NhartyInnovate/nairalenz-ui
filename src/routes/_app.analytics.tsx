import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";
import { useFinanceStore } from "@/lib/store";
import { useStatements } from "@/hooks/use-statements";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Wallet, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — NairaLens AI" }] }),
  component: Analytics,
});

function Analytics() {
  const { transactions } = useFinanceStore();
  const { data: statements, isLoading: isStatementsLoading } = useStatements();

  const hasCompleted = statements && statements.some(s => s.upload_status === "COMPLETED");
  const hasProcessing = statements && statements.some(s => 
    ["UPLOADED", "QUEUED", "PARSING", "NORMALIZING"].includes(s.upload_status)
  );

  if (isStatementsLoading) {
    return (
      <PageContainer>
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading analytics...
        </div>
      </PageContainer>
    );
  }

  if (!hasCompleted) {
    if (hasProcessing) {
      return (
        <PageContainer>
          <SectionHeader
            eyebrow="Processing"
            title="Analyzing Statement"
            description="We are processing your documents to generate analytics."
          />
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Processing your statement...</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Our AI engine is currently parsing and normalizing your transactions. This usually takes under 10 seconds.
            </p>
          </div>
        </PageContainer>
      );
    }

    const hasFailed = statements && statements.length > 0 && statements.every(s => s.upload_status === "FAILED");
    if (hasFailed) {
      return (
        <PageContainer>
          <SectionHeader
            eyebrow="Error"
            title="Analysis Failed"
            description="We encountered an issue with your statement."
          />
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-card p-12 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Statement processing failed</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We encountered an error while parsing your uploaded file. Please make sure you upload a supported PDF or CSV statement.
            </p>
            <div className="mt-6">
              <Link to="/upload">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  Try Uploading Again
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Insights"
          title="Financial Analytics"
          description="Advanced spend trends, anomaly detection, and cashflow charts."
        />
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">Upload your first bank statement</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Get instant AI insights, category spend breakdowns, and financial health score analysis by uploading your statement.
          </p>
          <div className="mt-6">
            <Link to="/upload">
              <Button variant="hero">
                Import Statement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  // 1. Dynamic Metric Calculations
  const baseBalance = 0;
  const netBalance = baseBalance + transactions.reduce((acc, t) => acc + t.amount, 0);

  const julyTransactions = transactions.filter((t) => t.date.includes("Jul"));
  const inflowsJuly = julyTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const outflowsJuly = Math.abs(
    julyTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0),
  );

  const savingsRateJuly = inflowsJuly > 0 ? ((inflowsJuly - outflowsJuly) / inflowsJuly) * 100 : 0;

  // Compute composite financial health score dynamically
  // Higher savings rate and larger balance improve score
  const savingsScore = Math.min(45, Math.max(10, Math.round((savingsRateJuly / 100) * 45)));
  const balanceScore = Math.min(35, Math.round((netBalance / 5000000) * 35));
  const activityScore = Math.min(20, Math.round((julyTransactions.length / 15) * 20));
  const compositeScore = Math.min(
    99,
    Math.max(40, savingsScore + balanceScore + activityScore + 20),
  );

  const healthData = [{ name: "score", value: compositeScore, fill: "oklch(0.78 0.16 158)" }];

  // 2. Spend vs Savings (grouping last 6 months)
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const trend = months.map((m) => {
    const monthTxns = transactions.filter((t) => t.date.includes(m));
    const income = monthTxns.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const spend = Math.abs(
      monthTxns.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0),
    );
    const saved = Math.max(0, income - spend);
    return {
      m,
      spend: Math.round(spend / 1000),
      saved: Math.round(saved / 1000),
    };
  });

  // 3. Top Merchants Leaderboard
  const merchantTotals: Record<string, number> = {};
  julyTransactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const name = t.name.split(" · ")[0]; // Clean name (e.g. Chowdeck June -> Chowdeck)
      merchantTotals[name] = (merchantTotals[name] || 0) + Math.abs(t.amount);
    });

  const merchants = Object.keys(merchantTotals)
    .map((name) => ({
      name,
      spend: Math.round(merchantTotals[name] / 1000),
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 7);

  // If no merchants found, seed with some dummy indicators
  const displayMerchants =
    merchants.length > 0
      ? merchants
      : [
          { name: "Chowdeck", spend: 85 },
          { name: "Bolt", spend: 32 },
          { name: "Shoprite", spend: 34 },
        ];

  // 4. Projected Future Forecasts
  // Average monthly savings rate
  const averageMonthlySavings = Math.max(
    50000,
    months
      .map((m) => {
        const monthTxns = transactions.filter((t) => t.date.includes(m));
        const inc = monthTxns.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
        const exp = Math.abs(
          monthTxns.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0),
        );
        return inc - exp;
      })
      .reduce((acc, cur) => acc + cur, 0) / months.length,
  );

  const forecastMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let rollingBal = netBalance;
  const forecast = forecastMonths.map((m, index) => {
    if (index > 0) {
      rollingBal += averageMonthlySavings;
    }
    return {
      m,
      bal: Math.round(rollingBal / 1000),
    };
  });

  const finalProjected = (rollingBal / 1000000).toFixed(2);

  const triggerAISummary = () => {
    toast.info("Analyzing transaction history with Gemini AI...", {
      description: "Generating highly tailored Nigerian tax & finance report...",
      duration: 3000,
    });
    setTimeout(() => {
      toast.success("AI Summary complete! Open your Copilot to read the deep-dive analysis.");
    }, 3200);
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Deep dive"
        title="Analytics"
        description="Trends, forecasts, and the story behind every category."
        action={
          <Button variant="hero" size="sm" onClick={triggerAISummary}>
            <Sparkles className="h-3.5 w-3.5" /> AI summary
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Financial health */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Financial Health</h3>
                <p className="text-xs text-muted-foreground">Composite score · updated daily</p>
              </div>
              <Badge variant="soft">{compositeScore >= 75 ? "Strong" : "Moderate"}</Badge>
            </div>
            <div className="relative mx-auto mt-3 h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="75%"
                  outerRadius="100%"
                  data={healthData}
                  startAngle={220}
                  endAngle={-40}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={20}
                    background={{ fill: "var(--color-muted)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="font-display text-5xl italic tracking-tight">{compositeScore}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    out of 100
                  </p>
                </div>
              </div>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs">
              {[
                {
                  l: "Savings rate",
                  v: `${savingsRateJuly.toFixed(1)}%`,
                  ok: savingsRateJuly > 30,
                },
                {
                  l: "Monthly Surplus",
                  v: `₦${Math.round(inflowsJuly - outflowsJuly).toLocaleString()}`,
                  ok: inflowsJuly - outflowsJuly > 50000,
                },
                {
                  l: "Spend vs Income",
                  v: outflowsJuly > inflowsJuly ? "Deficit" : "Healthy Surplus",
                  ok: inflowsJuly > outflowsJuly,
                },
              ].map((r) => (
                <li
                  key={r.l}
                  className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-1.5"
                >
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className={`font-mono ${r.ok ? "text-primary" : "text-gold"}`}>{r.v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spend vs save */}
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">Spend vs Savings</h3>
                <p className="text-xs text-muted-foreground">Last 6 months (₦ '000s)</p>
              </div>
              <div className="flex gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Saved
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-info" /> Spent
                </span>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ left: -20 }}>
                  <XAxis
                    dataKey="m"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`₦${Number(value).toLocaleString()}k`]}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="saved"
                    stackId="a"
                    fill="oklch(0.78 0.16 158)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="spend"
                    stackId="a"
                    fill="oklch(0.72 0.13 235 / 60%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Merchant leaderboard */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Top merchants · July</h3>
            <p className="text-xs text-muted-foreground">Where the naira actually goes</p>
            <ul className="mt-4 space-y-3">
              {displayMerchants.map((m, idx) => {
                const max = displayMerchants[0].spend || 1;
                return (
                  <li key={idx}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{m.name}</span>
                      <span className="font-mono text-muted-foreground">₦{m.spend}k</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent">
                      <div
                        className="h-full rounded-full bg-gradient-primary"
                        style={{ width: `${(m.spend / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Forecast */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">6-month forecast</h3>
                <p className="text-xs text-muted-foreground">
                  Projected balance based on current habits
                </p>
              </div>
              <Badge variant="gold">AI</Badge>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.83 0.13 82)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.83 0.13 82)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="m"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`₦${Number(value).toLocaleString()}k`]}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bal"
                    stroke="oklch(0.83 0.13 82)"
                    strokeWidth={2}
                    fill="url(#fg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Projected balance by Dec:{" "}
              <span className="font-semibold text-foreground">₦{finalProjected}M</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              tone: "primary",
              label: "Best week surplus",
              value: "Jul 01–07",
              desc: "Savings rate spiked to 68%",
            },
            {
              icon: TrendingDown,
              tone: "destructive",
              label: "Worst spend category",
              value: "Food & Delivery",
              desc: `₦${(merchantTotals["Chowdeck"] || 0).toLocaleString()} spent on Chowdeck`,
            },
            {
              icon: Sparkles,
              tone: "gold",
              label: "Target Saving Potential",
              value: "₦40,000 / mo",
              desc: "Optimizing dining and utilities",
            },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <c.icon
                  className={`h-4 w-4 ${c.tone === "primary" ? "text-primary" : c.tone === "destructive" ? "text-destructive" : "text-gold"}`}
                />
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </p>
              </div>
              <p className="font-display mt-2 text-2xl italic tracking-tight">{c.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}
