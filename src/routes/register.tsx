import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { AuthSide, Field } from "./login";
import { Mail, Lock, User, ArrowRight, Chrome, Check } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create your account — NairaLens AI" }] }),
  component: Register,
});

function Register() {
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

          <div className="mt-6 space-y-3">
            <Button variant="outline" size="lg" className="w-full justify-center">
              <Chrome className="h-4 w-4" /> Sign up with Google
            </Button>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or email{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <Field
              icon={<User className="h-4 w-4" />}
              label="Full name"
              placeholder="Adaeze Okafor"
            />
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              placeholder="you@company.com"
              type="email"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              label="Password"
              placeholder="At least 8 characters"
              type="password"
            />
            <Button variant="hero" size="lg" className="w-full" asChild>
              <Link to="/dashboard">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              By continuing, you agree to our <a className="underline">Terms</a> and{" "}
              <a className="underline">Privacy Policy</a>.
            </p>
          </div>

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
