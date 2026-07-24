import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  delta,
  positive,
  icon,
  accent = "primary",
  sublabel,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon?: ReactNode;
  accent?: "primary" | "gold" | "info" | "destructive";
  sublabel?: string;
}) {
  const accentClass = {
    primary: "bg-primary-soft/50 text-primary",
    gold: "bg-gold/15 text-gold",
    info: "bg-info/15 text-info",
    destructive: "bg-destructive/15 text-destructive",
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-border-strong">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mesh opacity-60 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg", accentClass)}>
            {icon}
          </span>
        )}
      </div>
      <div className="relative mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl italic tracking-tight text-foreground">{value}</span>
      </div>
      <div className="relative mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              positive ? "bg-primary-soft/50 text-primary" : "bg-destructive/15 text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
        {sublabel && <span className="text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display mt-1 text-3xl italic tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8", className)}>
      {children}
    </div>
  );
}
