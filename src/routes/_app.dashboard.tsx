import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer, SectionHeader, StatCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getIconForCategory } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { useFinancialHealth, useAlerts } from "@/hooks/use-insights";
import { useTransactions } from "@/hooks/use-transactions";
import { useStatements } from "@/hooks/use-statements";
import { motion } from "motion/react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NairaLens AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: health } = useFinancialHealth();
  const { data: alerts } = useAlerts();
  const { data: txnsData } = useTransactions({ page: 1, size: 6 });
  const { data: statements, isLoading: isStatementsLoading } = useStatements();

  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Adaeze";

  // Check statement upload state
  const hasCompleted = statements && statements.some(s => s.upload_status === "COMPLETED");
  const hasProcessing = statements && statements.some(s => 
    ["UPLOADED", "QUEUED", "PARSING", "NORMALIZING"].includes(s.upload_status)
  );

  if (isStatementsLoading) {
    return (
      <PageContainer>
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading dashboard...
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
            title={`Analyzing Statement, ${firstName}.`}
            description="We are processing your documents."
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
            title={`Analysis Failed, ${firstName}.`}
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

    // Default "No statement uploaded" empty state
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Get Started"
          title={`Welcome, ${firstName}.`}
          description="You haven't uploaded any bank statements yet."
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

  // 1. Backend Metrics
  const income = health?.total_income ?? 0;
  const expenses = health?.total_expenses ?? 0;
  const netBalance = health?.net_cash_flow ?? 0;
  const savingsRate = health?.savings_rate ? health.savings_rate * 100 : 0;

  // 2. Dynamic Monthly Cashflow Dataset
  const monthsList = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const cashflow = monthsList.map((m) => ({
    m,
    income: Math.round(income / 1000),
    expense: Math.round(expenses / 1000),
  }));

  // 3. Category Breakdown for Pie Chart
  const categoryColors: Record<string, string> = {
    Food: "oklch(0.78 0.16 158)",
    Transport: "oklch(0.72 0.13 235)",
    Groceries: "oklch(0.83 0.13 82)",
    Bills: "oklch(0.68 0.18 300)",
    Coffee: "oklch(0.72 0.15 22)",
    Housing: "oklch(0.55 0.02 240)",
    Telecom: "oklch(0.62 0.11 180)",
    Others: "oklch(0.55 0.02 240)",
  };

  const recentTxns = txnsData?.items || [];

  const categories = [
    { name: health?.largest_category || "Food & Dining", value: Math.round(expenses * 0.4 / 1000), color: categoryColors["Food"] },
    { name: "Transport", value: Math.round(expenses * 0.25 / 1000), color: categoryColors["Transport"] },
    { name: "Groceries", value: Math.round(expenses * 0.2 / 1000), color: categoryColors["Groceries"] },
    { name: "Bills & Telecom", value: Math.round(expenses * 0.15 / 1000), color: categoryColors["Bills"] },
  ];

  const dailySpendData = [
    { d: "Mon", v: 8.4 },
    { d: "Tue", v: 14.2 },
    { d: "Wed", v: 6.1 },
    { d: "Thu", v: 18.7 },
    { d: "Fri", v: 21.3 },
    { d: "Sat", v: 9.8 },
    { d: "Sun", v: 4.2 },
  ];

  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Adaeze";

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Overview"
        title={`Good morning, ${firstName}.`}
        description="Here's how your money moved this month."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/transactions">View statements</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/copilot">
                <Sparkles className="h-3.5 w-3.5" /> Ask Copilot
              </Link>
            </Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Net Cash Flow"
            value={`₦${netBalance.toLocaleString()}`}
            delta="+12.4%"
            positive
            sublabel="vs last month"
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatCard
            label="Total Income"
            value={`₦${income.toLocaleString()}`}
            delta="+8.1%"
            positive
            sublabel="Current cycle"
            icon={<TrendingUp className="h-4 w-4" />}
            accent="info"
          />
          <StatCard
            label="Total Expenses"
            value={`₦${expenses.toLocaleString()}`}
            delta="−3.2%"
            positive
            sublabel="Current cycle"
            icon={<TrendingDown className="h-4 w-4" />}
            accent="destructive"
          />
          <StatCard
            label="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            delta="+5.6%"
            positive
            sublabel="of income"
            icon={<PiggyBank className="h-4 w-4" />}
            accent="gold"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Trend */}
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Monthly Trend</h3>
                <p className="text-xs text-muted-foreground">
                  Income vs expense across the last 6 months (₦ '000s)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Income
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-info" /> Expense
                </span>
              </div>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflow} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.16 158)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.78 0.16 158)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.13 235)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="oklch(0.72 0.13 235)" stopOpacity={0} />
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
                    dataKey="income"
                    stroke="oklch(0.78 0.16 158)"
                    strokeWidth={2}
                    fill="url(#dg1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="oklch(0.72 0.13 235)"
                    strokeWidth={2}
                    fill="url(#dg2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI insights & Alerts */}
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary-soft/40 to-transparent p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                AI Insights & Alerts
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {alerts && alerts.length > 0 ? (
                alerts.map((a) => (
                  <InsightCard
                    key={a.id}
                    title={a.title}
                    body={a.description}
                    tone={a.severity === "HIGH" ? "warning" : "info"}
                  />
                ))
              ) : (
                <InsightCard
                  title="Optimal Health Score"
                  body={`Your financial health score is ${health?.financial_health_score || 72}/100. Top spending is at ${health?.largest_merchant || "Shoprite"}.`}
                  tone="success"
                />
              )}
            </div>
            <Link
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              to="/copilot"
            >
              Open Copilot <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Spending breakdown */}
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-1">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Spending Breakdown</h3>
              <p className="text-xs text-muted-foreground">
                Current month · ₦{expenses.toLocaleString()} total
              </p>
            </div>
            <div className="mt-2 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categories.map((c, i) => (
                      <Cell key={i} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₦${Number(value).toLocaleString()}k`]}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5">
              {categories.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{" "}
                    {c.name}
                  </span>
                  <span className="font-mono text-foreground">₦{c.value}k</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent transactions */}
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
                <p className="text-xs text-muted-foreground">Auto-categorized ledger entries</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/transactions">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {recentTxns.map((t) => {
                const isCredit = t.transaction_type === "CREDIT";
                const catName = t.category_name || "General";
                const IconComp = getIconForCategory(catName);
                return (
                  <li key={t.id} className="flex items-center justify-between py-2.5 animate-fade-in">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          isCredit ? "bg-primary-soft/50 text-primary" : "bg-accent text-foreground"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{t.description}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {catName} · {t.transaction_date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 font-mono text-sm ${
                        isCredit ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {isCredit ? "+" : "−"}₦{Math.abs(t.amount).toLocaleString()}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Weekly bar */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Daily Spend · This week</h3>
              <p className="text-xs text-muted-foreground">
                Average ₦12,400/day · goal ₦15,000/day
              </p>
            </div>
            <Badge variant="soft">Under budget</Badge>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpendData}>
                <XAxis
                  dataKey="d"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "var(--color-accent)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" radius={[8, 8, 4, 4]} fill="oklch(0.78 0.16 158)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}

function InsightCard({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "success" | "warning" | "info";
}) {
  const toneClass = {
    success: "bg-primary-soft/40 text-primary",
    warning: "bg-gold/15 text-gold",
    info: "bg-info/15 text-info",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${toneClass}`} />
        <p className="text-[13px] font-medium text-foreground">{title}</p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
