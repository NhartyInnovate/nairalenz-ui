import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LineChart,
  MessageSquare,
  Upload,
  TrendingUp,
  TrendingDown,
  Zap,
  Lock,
  Star,
  ChevronDown,
  Wallet,
  Eye,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NairaLens AI — Understand your money. Not just your balance." },
      {
        name: "description",
        content:
          "Upload your Nigerian bank statement and get AI-powered spending insights, forecasts, and a personal financial copilot in seconds.",
      },
    ],
  }),
  component: Landing,
});

const chartData = [
  { m: "Jan", income: 480, expense: 320 },
  { m: "Feb", income: 520, expense: 380 },
  { m: "Mar", income: 610, expense: 340 },
  { m: "Apr", income: 580, expense: 420 },
  { m: "May", income: 690, expense: 380 },
  { m: "Jun", income: 740, expense: 410 },
  { m: "Jul", income: 820, expense: 450 },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#copilot"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              AI Copilot
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="soft"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-ring" />
              AI Financial Intelligence · Built for Nigeria
            </Badge>
            <h1 className="font-display text-balance text-5xl leading-[1.02] tracking-tight text-foreground md:text-7xl">
              Understand your money.
              <br />
              <span className="italic text-primary">Not just your balance.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
              Upload a bank statement. NairaLens AI reads every line, uncovers your spending
              patterns, and chats with you like a private financial advisor.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Try NairaLens free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/dashboard">
                  <Eye className="h-4 w-4" /> See live demo
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Bank-grade encryption
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Read-only access
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" /> Insights in seconds
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="absolute -inset-6 -z-10 rounded-[32px] bg-mesh blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border-strong bg-card shadow-elegant">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  nairalens.ai / dashboard
                </span>
                <div />
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-3">
                <PreviewStat
                  icon={<Wallet className="h-4 w-4" />}
                  label="Net Balance"
                  value="₦2,486,910"
                  delta="+12.4%"
                  positive
                />
                <PreviewStat
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Income · July"
                  value="₦820,000"
                  delta="+8.1%"
                  positive
                />
                <PreviewStat
                  icon={<TrendingDown className="h-4 w-4" />}
                  label="Expenses · July"
                  value="₦452,300"
                  delta="−3.2%"
                  positive
                />
                <div className="md:col-span-2 rounded-xl border border-border bg-surface/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Cashflow · Last 7 months</p>
                    <Badge variant="ghost">Auto-analyzed</Badge>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.78 0.16 158)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="oklch(0.78 0.16 158)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.72 0.13 235)" stopOpacity={0.3} />
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
                        <YAxis hide />
                        <Tooltip
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
                          fill="url(#g1)"
                        />
                        <Area
                          type="monotone"
                          dataKey="expense"
                          stroke="oklch(0.72 0.13 235)"
                          strokeWidth={2}
                          fill="url(#g2)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/25 bg-primary-soft/30 p-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      AI Insight
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    You spend <span className="font-semibold">37%</span> of your income on food
                    delivery. Cutting this by ₦40,000 could save you{" "}
                    <span className="font-semibold text-primary">₦480k/year</span>.
                  </p>
                  <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    See breakdown <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            <p className="w-full text-center text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Compatible with statements from
            </p>
            {[
              "GTBank",
              "Access",
              "Zenith",
              "UBA",
              "Kuda",
              "Opay",
              "PalmPay",
              "Wema",
              "Stanbic",
            ].map((b) => (
              <span key={b} className="font-display text-lg italic text-muted-foreground">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Features
            </p>
            <h2 className="font-display mt-2 text-4xl italic tracking-tight md:text-5xl">
              Every naira, understood.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A single upload turns raw statements into a living view of your financial life.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: "One-click upload",
                desc: "PDF, CSV, or scanned statements. NairaLens parses every format from Nigerian banks in seconds.",
              },
              {
                icon: LineChart,
                title: "Auto-categorized spend",
                desc: "AI groups transactions into intuitive categories — food, transport, subscriptions, family — with 96% accuracy.",
              },
              {
                icon: MessageSquare,
                title: "Chat with your money",
                desc: '"How much did I spend on Bolt last month?" Ask anything. Get answers with charts.',
              },
              {
                icon: TrendingUp,
                title: "Cashflow forecast",
                desc: "See where you'll be in 30, 60, 90 days based on your habits — with confidence intervals.",
              },
              {
                icon: ShieldCheck,
                title: "Private by design",
                desc: "Statements are encrypted end-to-end. We never share, sell, or store card credentials.",
              },
              {
                icon: Zap,
                title: "Alerts that matter",
                desc: "Get notified only when something meaningful shifts — unusual spend, duplicate charge, new subscription.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elegant"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft/50 text-primary">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Copilot showcase */}
      <section
        id="copilot"
        className="relative overflow-hidden border-t border-border bg-hero py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:items-center">
          <div>
            <Badge variant="soft" className="mb-4">
              AI Copilot
            </Badge>
            <h2 className="font-display text-4xl italic leading-[1.05] md:text-5xl">
              A private advisor that <span className="text-primary">actually reads</span> your
              statements.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Ask questions in plain English or pidgin. NairaLens answers with numbers, context, and
              clear next steps — grounded in your real data.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Which subscriptions am I still paying but never use?",
                "Compare my food spend this quarter vs last quarter.",
                "If I save ₦150k monthly, when can I afford a laptop upgrade?",
              ].map((q) => (
                <li
                  key={q}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">"{q}"</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-strong bg-card p-5 shadow-elegant">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </span>
                <div>
                  <p className="text-sm font-semibold">NairaLens Copilot</p>
                  <p className="text-[10px] text-muted-foreground">
                    Online · analyzing 1,284 transactions
                  </p>
                </div>
              </div>
              <Badge variant="ghost">GPT-4 class</Badge>
            </div>
            <div className="space-y-3">
              <ChatBubble role="user">How much did I spend on transport last month?</ChatBubble>
              <ChatBubble role="assistant">
                In June you spent <b>₦68,420</b> on transport across 47 trips — mostly Bolt (₦41k)
                and fuel (₦22k). That's <b className="text-primary">14% less</b> than May.
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <MiniCell label="Bolt" value="₦41,200" />
                  <MiniCell label="Fuel" value="₦22,100" />
                  <MiniCell label="Uber" value="₦5,120" />
                </div>
              </ChatBubble>
              <ChatBubble role="user">Where can I save the most?</ChatBubble>
              <ChatBubble role="assistant">
                Your biggest opportunity: <b>food delivery</b>. You spend <b>₦112k/mo</b> on Jumia
                Food & Chowdeck. Cooking 3 nights/week could save{" "}
                <b className="text-primary">~₦45k monthly</b>.
              </ChatBubble>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface/60 p-2">
              <input
                placeholder="Ask about your finances…"
                className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button variant="hero" size="sm">
                <Sparkles className="h-3.5 w-3.5" /> Ask
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              Loved by
            </p>
            <h2 className="font-display mt-2 text-4xl italic md:text-5xl">
              Nigerians who take money seriously.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Chiamaka N.",
                role: "Product Manager · Lagos",
                quote:
                  "I finally see where my salary goes. The AI caught two subscriptions I forgot about — paid for a year of NairaLens in one insight.",
              },
              {
                name: "Tunde A.",
                role: "Founder · Abuja",
                quote:
                  "It's like Mint, but it actually understands Nigerian banks. And the Copilot chats like a smart friend, not a bot.",
              },
              {
                name: "Zainab I.",
                role: "Doctor · Port Harcourt",
                quote:
                  "Beautiful, calm, trustworthy. I recommend NairaLens to every one of my colleagues.",
              },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-5xl italic leading-[1.05] md:text-6xl">
            Your statements have <span className="text-primary">stories</span>.<br /> We help you
            read them.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Start free. No card required. Import your first statement in under 60 seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/dashboard">Explore demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">FAQ</p>
            <h2 className="font-display mt-2 text-4xl italic md:text-5xl">Questions, answered.</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is my bank data safe?",
                a: "Yes. Statements are encrypted at rest and in transit with AES-256. We never store bank credentials or card numbers, and access is read-only.",
              },
              {
                q: "Which banks are supported?",
                a: "All major Nigerian banks (GTBank, Access, Zenith, UBA, First Bank, Wema, Stanbic) and fintechs (Kuda, Opay, PalmPay, Moniepoint, Carbon).",
              },
              {
                q: "Do I need to connect my bank account?",
                a: "No. NairaLens works entirely from statement uploads (PDF, CSV, or scans). Direct connections are optional.",
              },
              {
                q: "How accurate is the AI categorization?",
                a: "Our fine-tuned models achieve 96% accuracy on Nigerian merchants and can be corrected once — the AI learns from your feedback.",
              },
              {
                q: "What does it cost?",
                a: "The core product is free forever. Copilot Pro unlocks unlimited AI chats and forecasts for ₦2,500/month.",
              },
            ].map((f, i) => (
              <AccordionItem key={i} value={`i${i}`} className="border-border">
                <AccordionTrigger className="text-left text-[15px] font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              AI Financial Intelligence for Nigerians. Understand your money. Not just your balance.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#copilot" className="hover:text-foreground">
                  AI Copilot
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NairaLens AI. Made with care in Lagos.</p>
          <p className="font-mono">v1.0 · encrypted end-to-end</p>
        </div>
      </footer>
    </div>
  );
}

function PreviewStat({
  icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-soft/50 text-primary">
          {icon}
        </span>
      </div>
      <p className="font-display mt-2 text-2xl italic tracking-tight">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-[11px] font-medium ${positive ? "text-primary" : "text-destructive"}`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-foreground"}`}
      >
        {children}
      </div>
    </div>
  );
}
function MiniCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-1.5">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono font-medium text-foreground">{value}</p>
    </div>
  );
}
