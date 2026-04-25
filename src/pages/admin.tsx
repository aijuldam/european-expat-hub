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
import { ArrowRight, LogOut, Download, Users, Mail, TrendingUp, Calendar, Activity, Eye, MousePointerClick, Globe } from "lucide-react";

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
  quiz_answers: Record<string, string | string[]> | null;
  top_city_1: string | null;
  top_city_1_pct: number | null;
  top_city_2: string | null;
  top_city_2_pct: number | null;
  top_city_3: string | null;
  top_city_3_pct: number | null;
  marketing_consent: boolean | null;
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
  const cols = [
    "id", "email", "created_at", "source", "utm_source", "utm_medium", "utm_campaign",
    "country_interest", "top_city_1", "top_city_1_pct", "top_city_2", "top_city_2_pct",
    "top_city_3", "top_city_3_pct", "marketing_consent", "quiz_answers",
  ];
  const rows = leads.map((l) =>
    cols.map((c) => {
      const v = (l as Record<string, unknown>)[c];
      return JSON.stringify(v != null && typeof v === "object" ? JSON.stringify(v) : v ?? "");
    }).join(",")
  );
  const blob = new Blob([cols.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `expatlix-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim()) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
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
          <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a magic link.</p>
          {sent ? (
            <p className="text-sm text-accent font-medium">✅ Check your inbox for the login link.</p>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button onClick={handleLogin} disabled={loading} className="w-full gap-2">
                {loading ? "Sending…" : "Send magic link"}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
            </div>
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

// ── Traffic types & tab ──────────────────────────────────────────────────────
interface Traffic {
  days: number;
  kpi: { sessions: number; users: number; pageviews: number; bounceRate: number; avgSessionSec: number };
  pages: { path: string; views: number; users: number }[];
  channels: { channel: string; sessions: number; users: number }[];
  funnel: { quiz_start: number; quiz_step: number; quiz_complete: number; email_capture: number; quiz_skip: number };
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

function TrafficTab({ accessToken }: { accessToken: string }) {
  const [days, setDays] = useState<1 | 7 | 30 | 365>(7);
  const [data, setData] = useState<Traffic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError("");
    fetch(`/api/analytics?days=${days}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? r.statusText);
        return j as Traffic;
      })
      .then((j) => { if (!cancel) setData(j); })
      .catch((e: Error) => { if (!cancel) setError(e.message); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [days, accessToken]);

  const labels: Record<typeof days, string> = { 1: "Today", 7: "7 days", 30: "30 days", 365: "1 year" };
  const completionRate = data && data.funnel.quiz_start > 0
    ? ((data.funnel.quiz_complete / data.funnel.quiz_start) * 100).toFixed(1)
    : "0";
  const captureRate = data && data.funnel.quiz_complete > 0
    ? ((data.funnel.email_capture / data.funnel.quiz_complete) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Timeframe toggle */}
      <div className="flex justify-end">
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {([1, 7, 30, 365] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 transition-colors ${
                days === d ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {labels[d]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <Card><CardContent className="p-5 text-sm text-destructive">Failed to load: {error}</CardContent></Card>
      )}

      {loading && !data ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading traffic…</p>
      ) : data ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI label="Sessions"    value={data.kpi.sessions}              icon={Activity} />
            <KPI label="Users"       value={data.kpi.users}                 icon={Users} />
            <KPI label="Page views"  value={data.kpi.pageviews}             icon={Eye} />
            <KPI label="Bounce rate" value={`${(data.kpi.bounceRate * 100).toFixed(1)}%`} icon={MousePointerClick} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Channels */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" /> Channels
                </h3>
                {data.channels.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 font-medium text-muted-foreground text-xs">Channel</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Sessions</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.channels.map((c) => (
                        <tr key={c.channel} className="border-b border-border/50">
                          <td className="py-2 text-foreground text-xs">{c.channel}</td>
                          <td className="py-2 text-right text-xs">{fmt(c.sessions)}</td>
                          <td className="py-2 text-right text-xs text-muted-foreground">{fmt(c.users)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* Quiz funnel */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" /> Quiz funnel
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Quiz starts",     n: data.funnel.quiz_start },
                    { label: "Quiz completes",  n: data.funnel.quiz_complete },
                    { label: "Email captures",  n: data.funnel.email_capture },
                    { label: "Skips",           n: data.funnel.quiz_skip },
                  ].map((row) => {
                    const pct = data.funnel.quiz_start > 0 ? (row.n / data.funnel.quiz_start) * 100 : 0;
                    return (
                      <div key={row.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground">{row.label}</span>
                          <span className="text-muted-foreground text-xs">{fmt(row.n)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Completion rate</p>
                    <p className="text-lg font-bold text-foreground">{completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capture rate</p>
                    <p className="text-lg font-bold text-foreground">{captureRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top pages */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Top pages</h3>
              {data.pages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 font-medium text-muted-foreground text-xs">Path</th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Views</th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages.map((p) => (
                      <tr key={p.path} className="border-b border-border/50">
                        <td className="py-2 text-foreground text-xs font-mono truncate max-w-[400px]">{p.path}</td>
                        <td className="py-2 text-right text-xs">{fmt(p.views)}</td>
                        <td className="py-2 text-right text-xs text-muted-foreground">{fmt(p.users)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Avg session: {fmtDuration(data.kpi.avgSessionSec)}
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<"leads" | "traffic">("leads");
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

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {(["leads", "traffic"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "traffic" ? (
          <TrafficTab accessToken={session.access_token} />
        ) : (
        <div className="space-y-8">
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
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Top cities</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Source</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground text-xs">Marketing</th>
                      <th className="pb-3 font-medium text-muted-foreground text-xs">Answers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors align-top">
                        <td className="py-3 pr-4 font-medium text-foreground text-xs">{lead.email}</td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(lead.created_at)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {lead.top_city_1 ? (
                            <div className="space-y-0.5">
                              <div className="text-foreground font-medium">{lead.top_city_1} <span className="text-accent">{lead.top_city_1_pct}%</span></div>
                              {lead.top_city_2 && <div>{lead.top_city_2} {lead.top_city_2_pct}%</div>}
                              {lead.top_city_3 && <div>{lead.top_city_3} {lead.top_city_3_pct}%</div>}
                            </div>
                          ) : "—"}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs">{lead.utm_source ?? "direct"}</td>
                        <td className="py-3 pr-4 text-xs">
                          {lead.marketing_consent
                            ? <span className="text-accent font-medium">✓ Yes</span>
                            : <span className="text-muted-foreground">No</span>}
                        </td>
                        <td className="py-3 text-xs text-muted-foreground max-w-[200px]">
                          {lead.quiz_answers
                            ? <details><summary className="cursor-pointer hover:text-foreground">View</summary>
                                <pre className="mt-1 text-[10px] bg-muted p-2 rounded overflow-auto max-h-40">
                                  {JSON.stringify(lead.quiz_answers, null, 2)}
                                </pre>
                              </details>
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-3">{fmt(filtered.length)} leads shown</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
        )}

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
