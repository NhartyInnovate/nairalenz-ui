import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Search, Bell, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/80 px-3 backdrop-blur-xl md:px-6">
            <SidebarTrigger className="hidden md:inline-flex" />
            <div className="md:hidden">
              <span className="font-display text-lg italic text-primary">NairaLens</span>
            </div>

            <div className="hidden flex-1 md:block">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search transactions, insights, merchants…"
                  className="h-9 w-full rounded-lg border border-border bg-surface/60 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <kbd className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <Button variant="hero" size="sm" className="hidden sm:inline-flex">
                Upload statement
              </Button>
            </div>
          </header>

          <main className="flex-1 pb-24 md:pb-8">
            <Outlet />
          </main>
        </div>

        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
