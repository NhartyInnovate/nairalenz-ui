import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { AuthSide, Field } from "./login";
import { Mail, Lock, User, ArrowRight, Chrome, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create your account — NairaLens AI" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const { register, login, isRegistering } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      await register({ email: email.trim(), full_name: fullName.trim(), password });
      toast.success("Account created successfully! Logging you in...");
      try {
        await login({ email: email.trim(), password });
        navigate({ to: "/dashboard" });
      } catch {
        navigate({ to: "/login" });
      }
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please try again.";
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
            Get started
          </p>
          <h1 className="font-display mt-1 text-4xl italic tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Free forever. No card required.</p>

          <ul className="mt-5 space-y-1.5 text-xs text-muted-foreground">
            {[
              "First insight in 60 seconds",
              "Bank-grade encryption, read-only",
              "Unlimited statement uploads on free tier",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary" /> {b}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-center"
              onClick={() => toast.info("Google OAuth signup will redirect in production mode.")}
            >
              <Chrome className="h-4 w-4" /> Sign up with Google
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
              icon={<User className="h-4 w-4" />}
              label="Full name"
              placeholder="Chinedu Okafor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
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
              placeholder="At least 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="hero" size="lg" className="w-full" type="submit" disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              By continuing, you agree to our <a className="underline cursor-pointer">Terms</a> and{" "}
              <a className="underline cursor-pointer">Privacy Policy</a>.
            </p>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
