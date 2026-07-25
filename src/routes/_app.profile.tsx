import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  Landmark,
  Save,
  X,
  Edit2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — NairaLens AI" }] }),
  component: Profile,
});

function Profile() {
  const { profile, updateProfile, files } = useFinanceStore();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for the editing form
  const [fullName, setFullName] = useState(user?.full_name || profile.fullName);
  const [householdSize, setHouseholdSize] = useState(profile.householdSize);
  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome);
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal);
  const [riskTolerance, setRiskTolerance] = useState(profile.riskTolerance);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({
      fullName,
      householdSize,
      monthlyIncome,
      primaryGoal,
      riskTolerance,
    });
    setIsEditing(false);
    toast.success("Financial profile updated successfully!");
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setHouseholdSize(profile.householdSize);
    setMonthlyIncome(profile.monthlyIncome);
    setPrimaryGoal(profile.primaryGoal);
    setRiskTolerance(profile.riskTolerance);
    setIsEditing(false);
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="You"
        title="Profile"
        description="How you appear inside NairaLens and to your Copilot."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Identity card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-28 bg-gradient-primary">
            <div className="absolute inset-0 grid-pattern opacity-30" />
          </div>
          <div className="relative -mt-12 px-6 pb-6">
            <div className="relative inline-block">
              <span className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-primary text-2xl font-semibold text-primary-foreground ring-4 ring-card">
                {(user?.full_name || profile.fullName)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <button className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-surface-elevated text-foreground shadow-sm hover:bg-accent transition">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <h2 className="font-display text-3xl italic tracking-tight">{user?.full_name || profile.fullName}</h2>
              <Badge variant="gold">Pro</Badge>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              <Row icon={<Mail className="h-3.5 w-3.5" />} label={user?.email || "user@nairalens.ai"} />
              <Row 
                icon={<Calendar className="h-3.5 w-3.5" />} 
                label={`Joined ${user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`} 
              />
            </ul>

            <div className="mt-6 flex gap-2">
              <Button
                variant="hero"
                size="sm"
                className="flex-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Details & editing panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Financial profile</h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Helps Copilot tailor advice to your reality
                </p>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Update
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Household size
                    </label>
                    <input
                      type="text"
                      value={householdSize}
                      onChange={(e) => setHouseholdSize(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Monthly income (₦)
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Primary savings goal
                  </label>
                  <input
                    type="text"
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Risk tolerance
                  </label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface/60 px-3 text-sm focus:border-primary/50 focus:outline-none"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  <Button variant="hero" size="sm" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5 mr-1" /> Save changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <Stat label="Household size" value={profile.householdSize} />
                <Stat label="Monthly income" value={`₦${profile.monthlyIncome.toLocaleString()}`} />
                <Stat label="Primary goal" value={profile.primaryGoal} />
                <Stat label="Risk tolerance" value={profile.riskTolerance} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Connected accounts</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Statement sources parsed by NairaLens
            </p>
            <ul className="space-y-2">
              {[
                { bank: "GTBank", masked: "•••• 4210", txns: 12 },
                { bank: "Kuda", masked: "•••• 0028", txns: 8 },
                { bank: "Access", masked: "•••• 9911", txns: 6 },
              ].map((b) => (
                <li
                  key={b.bank}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft/40 text-primary">
                      <Landmark className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{b.bank}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {b.masked} · {b.txns} transactions
                      </p>
                    </div>
                  </div>
                  <Badge variant="soft">
                    <ShieldCheck className="mr-1 h-2.5 w-2.5" /> Secure
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3 text-muted-foreground">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent">{icon}</span>
      <span className="text-foreground">{label}</span>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
