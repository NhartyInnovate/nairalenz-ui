import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Upload, ArrowLeftRight, BarChart3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Copilot", url: "/copilot", icon: Sparkles, primary: true },
  { title: "Txns", url: "/transactions", icon: ArrowLeftRight },
  { title: "Insights", url: "/analytics", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.url;
          if (it.primary) {
            return (
              <li key={it.title} className="flex items-start justify-center">
                <Link
                  to={it.url}
                  className="mt-[-18px] grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow ring-4 ring-background"
                  aria-label={it.title}
                >
                  <it.icon className="h-5 w-5 text-primary-foreground" />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.title}>
              <Link
                to={it.url}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <it.icon className="h-4 w-4" />
                {it.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
