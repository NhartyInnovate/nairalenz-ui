import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Upload,
  ArrowLeftRight,
  BarChart3,
  Sparkles,
  User,
  Settings as SettingsIcon,
  LogOut,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const main = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Statement", url: "/upload", icon: Upload },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "AI Copilot", url: "/copilot", icon: Sparkles, badge: "New" },
];

const account = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Logo showWord={!collapsed} />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-9 rounded-lg text-sm font-medium transition",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                        <span className="truncate">{item.title}</span>
                        {item.badge && !collapsed && (
                          <Badge variant="soft" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-9 rounded-lg text-sm font-medium transition",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-4 rounded-xl border border-sidebar-border bg-gradient-to-b from-primary-soft/40 to-transparent p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Copilot Pro</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Unlock deeper insights, forecasts, and unlimited AI chats.
            </p>
            <button className="mt-2.5 w-full rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground transition hover:opacity-90">
              Upgrade
            </button>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg p-1.5",
            !collapsed && "hover:bg-sidebar-accent/60",
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/30">
            <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
              AO
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">Adaeze Okafor</p>
              <p className="truncate text-[10px] text-muted-foreground">adaeze@nairalens.ai</p>
            </div>
          )}
          {!collapsed && (
            <button
              className="rounded-md p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {!collapsed && (
          <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground transition hover:bg-sidebar-accent/60 hover:text-foreground">
            <HelpCircle className="h-3.5 w-3.5" /> Help & docs
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
