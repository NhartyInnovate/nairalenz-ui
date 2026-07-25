import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Chrome, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NairaLens AI" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      await login({ email: email.trim(), password });
      toast.success("Login successful! Welcome back.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err?.message || "Login failed. Please check your credentials.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

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

          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-center"
              onClick={() => toast.info("Google OAuth login will redirect in production mode.")}
            >
              <Chrome className="h-4 w-4" /> Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or email{" "}
              <span className="h-px flex-1 bg-border" />
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border bg-transparent text-primary focus:ring-ring/50"
                />{" "}
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button variant="hero" size="lg" className="w-full" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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
