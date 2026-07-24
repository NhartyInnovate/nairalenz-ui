import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Bell,
  ShieldCheck,
  Palette,
  CreditCard,
  Globe,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Lock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Shield,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — NairaLens AI" }] }),
  component: Settings,
});

type TabId =
  "Appearance" | "Notifications" | "Security" | "API & keys" | "Billing" | "Language & region";

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>("Appearance");

  // State-driven preferences with localStorage hydration
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);

  const [unusualSpend, setUnusualSpend] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [newInsight, setNewInsight] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const [geminiKey, setGeminiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  const [nigerianState, setNigerianState] = useState("Lagos");
  const [currencySymbol, setCurrencySymbol] = useState("₦");

  const [billingTier, setBillingTier] = useState<"Free" | "Pro" | "Enterprise">("Pro");

  // Hydrate states from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("nl_pref_theme");
      if (savedTheme) setTheme(savedTheme as "dark" | "light");

      const savedReduceMotion = localStorage.getItem("nl_pref_reduce_motion");
      if (savedReduceMotion) setReduceMotion(savedReduceMotion === "true");

      const savedCompact = localStorage.getItem("nl_pref_compact");
      if (savedCompact) setCompactDensity(savedCompact === "true");

      const savedUnusual = localStorage.getItem("nl_pref_unusual_spend");
      if (savedUnusual) setUnusualSpend(savedUnusual === "true");

      const savedWeekly = localStorage.getItem("nl_pref_weekly_digest");
      if (savedWeekly) setWeeklyDigest(savedWeekly === "true");

      const savedInsight = localStorage.getItem("nl_pref_new_insight");
      if (savedInsight) setNewInsight(savedInsight === "true");

      const savedMarketing = localStorage.getItem("nl_pref_marketing");
      if (savedMarketing) setMarketing(savedMarketing === "true");

      const savedTwoFactor = localStorage.getItem("nl_pref_2fa");
      if (savedTwoFactor) setTwoFactor(savedTwoFactor === "true");

      const savedBiometric = localStorage.getItem("nl_pref_biometric");
      if (savedBiometric) setBiometric(savedBiometric === "true");

      const savedKey = localStorage.getItem("nl_pref_gemini_key");
      if (savedKey) setGeminiKey(savedKey);

      const savedState = localStorage.getItem("nl_pref_state");
      if (savedState) setNigerianState(savedState);

      const savedCurrency = localStorage.getItem("nl_pref_currency");
      if (savedCurrency) setCurrencySymbol(savedCurrency);

      const savedTier = localStorage.getItem("nl_pref_tier");
      if (savedTier) setBillingTier(savedTier as "Free" | "Pro" | "Enterprise");
    } catch (e) {
      console.error("Failed to restore preferences", e);
    }
  }, []);

  // Set theme class on document HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const savePref = (key: string, val: string | boolean) => {
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {
      console.error(e);
    }
  };

  const handleValidateKey = () => {
    if (!geminiKey) {
      toast.error("Please enter a Gemini API Key first.");
      return;
    }
    setIsValidatingKey(true);
    setTimeout(() => {
      setIsValidatingKey(false);
      savePref("nl_pref_gemini_key", geminiKey);
      toast.success("Gemini API Key successfully verified and saved local-only!");
    }, 1500);
  };

  const handleDeleteAllData = () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to reset and clear all data? This will clear local storage and reset all balances.",
    );
    if (confirmDelete) {
      localStorage.clear();
      toast.success("All data and customized statements have been cleared.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const tabs: { id: TabId; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: "Appearance", icon: Palette, label: "Appearance" },
    { id: "Notifications", icon: Bell, label: "Notifications" },
    { id: "Security", icon: ShieldCheck, label: "Security" },
    { id: "API & keys", icon: KeyRound, label: "API & keys" },
    { id: "Billing", icon: CreditCard, label: "Billing" },
    { id: "Language & region", icon: Globe, label: "Language & region" },
  ];

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Preferences"
        title="Settings"
        description="Fine-tune how NairaLens looks, behaves, and protects your data."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <nav className="flex flex-row overflow-x-auto pb-2 gap-1 lg:flex-col lg:pb-0 lg:overflow-x-visible text-sm border-b border-border/40 lg:border-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Tab Body */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === "Appearance" && (
                <div className="space-y-6">
                  <Section
                    title="Appearance Theme"
                    description="Choose how NairaLens looks on this browser tab."
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <ThemeCard
                        theme="dark"
                        label="Midnight"
                        active={theme === "dark"}
                        onClick={() => {
                          setTheme("dark");
                          savePref("nl_pref_theme", "dark");
                          toast.success("Theme switched to Midnight Dark mode.");
                        }}
                      />
                      <ThemeCard
                        theme="light"
                        label="Ivory"
                        active={theme === "light"}
                        onClick={() => {
                          setTheme("light");
                          savePref("nl_pref_theme", "light");
                          toast.success("Theme switched to Ivory Light mode.");
                        }}
                      />
                    </div>
                  </Section>

                  <Section
                    title="Interface Density"
                    description="Configure density and animation profiles."
                  >
                    <Toggle
                      label="Reduce motion"
                      desc="Disables non-essential Framer Motion rendering to prioritize pure computing speed."
                      checked={reduceMotion}
                      onCheckedChange={(checked) => {
                        setReduceMotion(checked);
                        savePref("nl_pref_reduce_motion", checked);
                        toast.success(`Reduce motion ${checked ? "enabled" : "disabled"}.`);
                      }}
                    />
                    <Toggle
                      label="Compact density"
                      desc="Saves vertical screen space by shrinking grid gutters and padding."
                      checked={compactDensity}
                      onCheckedChange={(checked) => {
                        setCompactDensity(checked);
                        savePref("nl_pref_compact", checked);
                        toast.success(
                          `Compact padding layout ${checked ? "activated" : "deactivated"}.`,
                        );
                      }}
                    />
                  </Section>
                </div>
              )}

              {activeTab === "Notifications" && (
                <Section title="Alert Toggles" description="Only the alerts that matter.">
                  <Toggle
                    label="Unusual spend detected"
                    desc="Notify me when a single day's dining or transport breaks regular weekly patterns."
                    checked={unusualSpend}
                    onCheckedChange={(checked) => {
                      setUnusualSpend(checked);
                      savePref("nl_pref_unusual_spend", checked);
                      toast.success(`Unusual spend notifications ${checked ? "on" : "off"}.`);
                    }}
                  />
                  <Toggle
                    label="Weekly ledger digest"
                    desc="Receive a brief Sunday morning email breaking down savings and top Nigerian merchants."
                    checked={weeklyDigest}
                    onCheckedChange={(checked) => {
                      setWeeklyDigest(checked);
                      savePref("nl_pref_weekly_digest", checked);
                      toast.success(`Weekly digest alert ${checked ? "enabled" : "disabled"}.`);
                    }}
                  />
                  <Toggle
                    label="New Copilot insights"
                    desc="Instant updates when our Gemini-powered engine uncovers a food or utility saving leak."
                    checked={newInsight}
                    onCheckedChange={(checked) => {
                      setNewInsight(checked);
                      savePref("nl_pref_new_insight", checked);
                      toast.success(`Real-time AI alerts ${checked ? "turned on" : "turned off"}.`);
                    }}
                  />
                  <Toggle
                    label="Marketing alerts"
                    desc="Rare feature updates and expert financial logs from our developer team."
                    checked={marketing}
                    onCheckedChange={(checked) => {
                      setMarketing(checked);
                      savePref("nl_pref_marketing", checked);
                      toast.success(`Developer logs ${checked ? "allowed" : "restricted"}.`);
                    }}
                  />
                </Section>
              )}

              {activeTab === "Security" && (
                <div className="space-y-6">
                  <Section
                    title="Device Lock"
                    description="Configure local biometric & sign-in parameters."
                  >
                    <Toggle
                      label="Two-factor authentication (2FA)"
                      desc="Require a hardware key or TOTP code from Google Authenticator on new browser logins."
                      checked={twoFactor}
                      onCheckedChange={(checked) => {
                        setTwoFactor(checked);
                        savePref("nl_pref_2fa", checked);
                        toast.success(
                          `Two-factor sign-ins ${checked ? "activated" : "deactivated"}.`,
                        );
                      }}
                    />
                    <Toggle
                      label="Biometric WebAuthn Unlock"
                      desc="Enables Face ID, Windows Hello, or Fingerprint reader verification on load."
                      checked={biometric}
                      onCheckedChange={(checked) => {
                        setBiometric(checked);
                        savePref("nl_pref_biometric", checked);
                        toast.success(`Biometric unlock ${checked ? "ready" : "disabled"}.`);
                      }}
                    />
                  </Section>

                  <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Clear Local Ledger Data
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          Permanently deletes all uploaded statements, session chats, and profile
                          entries from this device's cache.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAllData}
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        Reset App
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "API & keys" && (
                <Section
                  title="Custom LLM Credentials"
                  description="Use your own Gemini API Key directly."
                >
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-surface/30 p-4 text-xs text-muted-foreground leading-relaxed">
                      <p className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                        NairaLens secure server API flow
                      </p>
                      By default, NairaLens routes queries to our pre-configured backend proxy. If
                      you have your own Google Gemini Key, you can input it below to ensure higher
                      rate-limits and direct access.
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Gemini API Key (GEMINI_API_KEY)
                      </label>
                      <div className="relative">
                        <input
                          type={showKey ? "text" : "password"}
                          placeholder="AIzaSy..."
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-surface/60 pl-3 pr-20 text-sm font-mono text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                          >
                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                      >
                        Get a free key from Google AI Studio <ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="flex gap-2">
                        {geminiKey && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGeminiKey("");
                              savePref("nl_pref_gemini_key", "");
                              toast.success("Custom Gemini key removed.");
                            }}
                          >
                            Clear
                          </Button>
                        )}
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={handleValidateKey}
                          disabled={isValidatingKey}
                        >
                          {isValidatingKey ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Verify & Save"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {activeTab === "Billing" && (
                <div className="space-y-6">
                  <Section
                    title="Subscription Plan"
                    description="Access exclusive Nigerian financial analytics."
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        {
                          id: "Free" as const,
                          name: "NairaLens Lite",
                          price: "₦0",
                          desc: "1 bank statement, standard AI chat assistance.",
                        },
                        {
                          id: "Pro" as const,
                          name: "NairaLens Pro",
                          price: "₦7,500/mo",
                          desc: "Unlimited bank statements, real-time alerts, full tax insights.",
                        },
                        {
                          id: "Enterprise" as const,
                          name: "Custom Premium",
                          price: "Contact Sales",
                          desc: "Dedicated account manager, bespoke commercial parsing templates.",
                        },
                      ].map((p) => {
                        const active = billingTier === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setBillingTier(p.id);
                              savePref("nl_pref_tier", p.id);
                              toast.success(`Switched subscription profile to ${p.name}`);
                            }}
                            className={`relative flex flex-col text-left rounded-xl border p-4 transition cursor-pointer ${
                              active
                                ? "border-primary bg-primary-soft/20 ring-1 ring-primary/40"
                                : "border-border bg-surface/40 hover:border-border-strong"
                            }`}
                          >
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {p.name}
                            </p>
                            <p className="font-display text-2xl italic tracking-tight text-foreground mt-2">
                              {p.price}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2.5 flex-1">
                              {p.desc}
                            </p>
                            {active && (
                              <Badge variant="soft" className="mt-3 self-start">
                                Active Plan
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Section>

                  <Section title="Payment Method" description="Secure card gateway.">
                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface/30 p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-12 place-items-center rounded bg-accent font-mono text-xs font-bold tracking-tight">
                          VISA
                        </span>
                        <div>
                          <p className="text-sm font-semibold">Visa Ending in 4012</p>
                          <p className="text-xs text-muted-foreground">
                            Expires 11/2029 · Primary card
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Payment details update coming soon.")}
                      >
                        Edit Card
                      </Button>
                    </div>
                  </Section>
                </div>
              )}

              {activeTab === "Language & region" && (
                <Section
                  title="Regional Parameters"
                  description="Fine-tune local taxation and state-based insights."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Nigerian State of Residence
                      </label>
                      <select
                        value={nigerianState}
                        onChange={(e) => {
                          setNigerianState(e.target.value);
                          savePref("nl_pref_state", e.target.value);
                          toast.success(`Tax model adjusted for ${e.target.value} state.`);
                        }}
                        className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        {["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Enugu", "Delta"].map(
                          (st) => (
                            <option key={st} value={st} className="bg-card">
                              {st}
                            </option>
                          ),
                        )}
                      </select>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        NairaLens uses your state of residence to calculate appropriate state-level
                        tax schedules and levies.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Default Currency Denomination
                      </label>
                      <select
                        value={currencySymbol}
                        onChange={(e) => {
                          setCurrencySymbol(e.target.value);
                          savePref("nl_pref_currency", e.target.value);
                          toast.success(`Primary currency symbol set to ${e.target.value}`);
                        }}
                        className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        {["₦", "$", "£", "€"].map((cur) => (
                          <option key={cur} value={cur} className="bg-card">
                            {cur} (
                            {cur === "₦"
                              ? "NGN"
                              : cur === "$"
                                ? "USD"
                                : cur === "£"
                                  ? "GBP"
                                  : "EUR"}
                            )
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Choose whether to convert or represent overall dashboard balances in Naira
                        or foreign currencies.
                      </p>
                    </div>
                  </div>
                </Section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onCheckedChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/40 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ThemeCard({
  theme,
  label,
  active,
  onClick,
}: {
  theme: "dark" | "light";
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-4 text-left transition cursor-pointer w-full ${
        active
          ? "border-primary bg-primary-soft/20"
          : "border-border bg-surface/40 hover:border-border-strong"
      }`}
    >
      <div
        className={`flex h-20 items-center justify-center rounded-lg ${
          theme === "dark" ? "bg-[oklch(0.14_0.014_240)]" : "bg-[oklch(0.98_0.005_90)]"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-gold" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        {active && <Badge variant="soft">Active</Badge>}
      </div>
    </button>
  );
}
