import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Eye, Chrome } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NairaLens AI" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      <AuthSide />
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Welcome back
          </p>
          <h1 className="font-display mt-1 text-4xl italic tracking-tight">Sign in to NairaLens</h1>
          <p className="mt-2 text-sm text-muted-foreground">Continue where you left off.</p>

          <div className="mt-8 space-y-3">
            <Button variant="outline" size="lg" className="w-full justify-center">
              <Chrome className="h-4 w-4" /> Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or email{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              placeholder="you@company.com"
              type="email"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              label="Password"
              placeholder="••••••••"
              type="password"
              endAdornment={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border bg-transparent text-primary focus:ring-ring/50"
                />{" "}
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button variant="hero" size="lg" className="w-full" asChild>
              <Link to="/dashboard">
                Sign in <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            New to NairaLens?{" "}
            <Link to="/register" className="font-medium text-foreground hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthSide() {
  return (
    <div className="relative hidden overflow-hidden bg-hero md:block">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <Logo />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Trusted intelligence
          </p>
          <h2 className="font-display mt-3 text-5xl italic leading-[1.05]">
            Understand your money.
            <br />
            <span className="text-primary">Not just your balance.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            NairaLens turns raw statements into a private, intelligent view of your financial life.
            Bank-grade, elegant, and calm by design.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["A", "T", "Z", "O"].map((c) => (
                <span
                  key={c}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-gradient-primary text-[11px] font-semibold text-primary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Joined by 12,400+ Nigerians this month</p>
          </div>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          © NairaLens AI · encrypted end-to-end
        </p>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
export function Field({
  icon,
  label,
  endAdornment,
  ...rest
}: {
  icon?: ReactNode;
  label: string;
  endAdornment?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground">{label}</span>
      <span className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground">{icon}</span>
        )}
        <input
          {...rest}
          className="h-11 w-full rounded-lg border border-border bg-surface/60 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        {endAdornment && <span className="absolute right-3">{endAdornment}</span>}
      </span>
    </label>
  );
}
