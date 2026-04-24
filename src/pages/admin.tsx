/**
 * /admin — Protected analytics dashboard
 * Auth: Supabase magic link (email sent to aijuldam@gmail.com)
 * Data: leads + events from Supabase
 */

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, Download, Users, Mail, TrendingUp, Calendar } from "lucide-react";

const ADMIN_EMAIL = "aijuldam@gmail.com";

// ── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  email: string;
  created_at: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country_interest: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function startOf(unit: "day" | "week" | "month") {
  const d = new Date();
  if (unit === "day")   { d.setHours(0, 0, 0, 0); }
  if (unit === "week")  { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); }
  if (unit === "month") { d.setDate(1); d.setHours(0, 0, 0, 0); }
  return d.toISOString();
}

function exportCSV(leads: Lead[]) {
  const cols = ["id", "email", "created_at", "source", "utm_source", "utm_medium", "utm_campaign", "country_interest"];
  const rows = leads.map((l) => cols.map((c) => JSON.stringify((l as Record<string, unknown>)[c] ?? "")).join(","));
  const blob = new Blob([cols.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `expatlix-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: "https://expatlix.com/admin" },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 text-center">
          <h1 className="text-xl font-serif font-bold text-foreground mb-2">Expatlix Admin</h1>
          <p className="text-sm text-muted-foreground mb-6">Send a magic link to {ADMIN_EMAIL}</p>
          {sent ? (
            <p className="text-sm text-accent font-medium">✅ Check your inbox for the login link.</p>
          ) : (
            <>
              <Button onClick={handleLogin} disabled={loading} className="w-full gap-2">
                {loading ? "Sending…" : "Send magic link"}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KPI({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
          <p className="text-2xl font-bold text-foreground">{typeof value === "number" ? fmt(value) : value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ session }: { session: Session }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.gte("created_at", startOf(filter === "today" ? "day" : filter));
    const { data } = await q;
    setLeads(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const sources = ["all", ...Array.from(new Set(leads.map((l) => l.utm_source ?? "direct").filter(Boolean)))];
  const filtered = sourceFilter === "all" ? leads : leads.filter((l) => (l.utm_source ?? "direct") === sourceFilter);

  const today     = leads.filter((l) => l.created_at >= startOf("day")).length;
  const thisWeek  = leads.filter((l) => l.created_at >= startOf("week")).length;
  const thisMonth = leads.filter((l) => l.created_at >= startOf("month")).length;

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif font-bold text-lg text-foreground">Expatlix Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{session.user.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI label="Total leads"   value={leads.length} icon={Users} />
          <KPI label="Today"         value={today}        icon={Calendar} />
          <KPI label="This week"     value={thisWeek}     icon={TrendingUp} />
          <KPI label="This month"    value={thisMonth}    icon={Mail} />
        </div>

        {/* Leads table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="font-semibold text-foreground">Leads</h2>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Timeframe filter */}
                <div className="flex rounded-md border border-border overflow-hidden text-xs">
                  {(["all", "today", "week", "month"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 capitalize transition-colors ${
                        filter === f ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {/* Source filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground"
                >
                  {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {/* Export */}
                <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)} className="gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" /> CSV
                </Button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Email</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Date</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Source</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Campaign</th>
                      <th className="pb-3 font-medium text-muted-foreground text-xs">Country interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium text-foreground">{lead.email}</td>
                        <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{fmtDate(lead.created_at)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{lead.utm_source ?? "direct"}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{lead.utm_campaign ?? "—"}</td>
                        <td className="py-3 text-muted-foreground">{lead.country_interest ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-3">{fmt(filtered.length)} leads shown</p>
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return null;
  if (!session || session.user.email !== ADMIN_EMAIL) return <LoginScreen />;
  return <Dashboard session={session} />;
}
