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
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
  countries: { countryId: string; country: string; users: number }[];
  quizSteps: { step: number; count: number }[];
}

// ISO-3166 alpha-2 → numeric TopoJSON id mapping (top ~60 countries by traffic likelihood)
// world-atlas uses numeric ISO-3166-1 codes on geometries
const ISO2_TO_NUMERIC: Record<string, string> = {
  AF:"004",AL:"008",DZ:"012",AD:"020",AO:"024",AG:"028",AR:"032",AM:"051",AU:"036",AT:"040",
  AZ:"031",BS:"044",BH:"048",BD:"050",BB:"052",BY:"112",BE:"056",BZ:"084",BJ:"204",BT:"064",
  BO:"068",BA:"070",BW:"072",BR:"076",BN:"096",BG:"100",BF:"854",BI:"108",CV:"132",KH:"116",
  CM:"120",CA:"124",CF:"140",TD:"148",CL:"152",CN:"156",CO:"170",KM:"174",CD:"180",CG:"178",
  CR:"188",HR:"191",CU:"192",CY:"196",CZ:"203",DK:"208",DJ:"262",DM:"212",DO:"214",EC:"218",
  EG:"818",SV:"222",GQ:"226",ER:"232",EE:"233",SZ:"748",ET:"231",FJ:"242",FI:"246",FR:"250",
  GA:"266",GM:"270",GE:"268",DE:"276",GH:"288",GR:"300",GD:"308",GT:"320",GN:"324",GW:"624",
  GY:"328",HT:"332",HN:"340",HU:"348",IS:"352",IN:"356",ID:"360",IR:"364",IQ:"368",IE:"372",
  IL:"376",IT:"380",JM:"388",JP:"392",JO:"400",KZ:"398",KE:"404",KI:"296",KW:"414",KG:"417",
  LA:"418",LV:"428",LB:"422",LS:"426",LR:"430",LY:"434",LI:"438",LT:"440",LU:"442",MG:"450",
  MW:"454",MY:"458",MV:"462",ML:"466",MT:"470",MH:"584",MR:"478",MU:"480",MX:"484",FM:"583",
  MD:"498",MC:"492",MN:"496",ME:"499",MA:"504",MZ:"508",MM:"104",NA:"516",NR:"520",NP:"524",
  NL:"528",NZ:"554",NI:"558",NE:"562",NG:"566",NO:"578",OM:"512",PK:"586",PW:"585",PA:"591",
  PG:"598",PY:"600",PE:"604",PH:"608",PL:"616",PT:"620",QA:"634",RO:"642",RU:"643",RW:"646",
  KN:"659",LC:"662",VC:"670",WS:"882",SM:"674",ST:"678",SA:"682",SN:"686",RS:"688",SC:"690",
  SL:"694",SG:"702",SK:"703",SI:"705",SB:"090",SO:"706",ZA:"710",SS:"728",ES:"724",LK:"144",
  SD:"729",SR:"740",SE:"752",CH:"756",SY:"760",TW:"158",TJ:"762",TZ:"834",TH:"764",TL:"626",
  TG:"768",TO:"776",TT:"780",TN:"788",TR:"792",TM:"795",TV:"798",UG:"800",UA:"804",AE:"784",
  GB:"826",US:"840",UY:"858",UZ:"860",VU:"548",VE:"862",VN:"704",YE:"887",ZM:"894",ZW:"716",
};

function CountryMap({ countries }: { countries: Traffic["countries"] }) {
  const [tooltip, setTooltip] = useState<{ name: string; users: number } | null>(null);
  const maxUsers = countries.reduce((m, c) => Math.max(m, c.users), 1);
  const byCode = Object.fromEntries(countries.map((c) => [ISO2_TO_NUMERIC[c.countryId] ?? c.countryId, c]));

  function fill(geoId: string) {
    const c = byCode[geoId];
    if (!c) return "#e5e7eb";
    // Log scale: lightest accent at 1 user, full accent at max
    const intensity = Math.log1p(c.users) / Math.log1p(maxUsers);
    const opacity = 0.15 + intensity * 0.85;
    return `rgba(16, 185, 129, ${opacity.toFixed(2)})`; // accent green
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" /> Traffic by country
        </h3>
        {countries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No country data yet.</p>
        ) : (
          <>
            <div className="relative rounded-md overflow-hidden bg-muted/30 mb-4" style={{ height: 300 }}>
              {tooltip && (
                <div className="absolute top-2 left-2 z-10 bg-background/95 border border-border rounded px-2 py-1 text-xs shadow">
                  <span className="font-medium">{tooltip.name}</span>
                  <span className="text-muted-foreground ml-2">{fmt(tooltip.users)} users</span>
                </div>
              )}
              <ComposableMap projectionConfig={{ scale: 120 }} style={{ width: "100%", height: "100%" }}>
                <ZoomableGroup zoom={1}>
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill(String(geo.id))}
                          stroke="#fff"
                          strokeWidth={0.3}
                          style={{ default: { outline: "none" }, hover: { outline: "none", opacity: 0.8 }, pressed: { outline: "none" } }}
                          onMouseEnter={() => {
                            const c = byCode[String(geo.id)];
                            if (c) setTooltip({ name: c.country, users: c.users });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>

            {/* Fallback table — top 10 */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground text-xs">Country</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Users</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {countries.slice(0, 10).map((c) => (
                  <tr key={c.countryId} className="border-b border-border/50">
                    <td className="py-2 text-foreground text-xs">{c.country}</td>
                    <td className="py-2 text-right text-xs">{fmt(c.users)}</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">
                      {((c.users / countries.reduce((s, x) => s + x.users, 0)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Quiz question labels for step-level funnel
const QUIZ_STEP_LABELS: Record<number, string> = {
  1: "Family status", 2: "Budget", 3: "Salary vs cost", 4: "Safety",
  5: "Weather", 6: "International vibe", 7: "City energy", 8: "Transport",
  9: "Language env",
};

function QuizFunnelDetail({ quizSteps, quizStart }: { quizSteps: Traffic["quizSteps"]; quizStart: number }) {
  if (quizSteps.length === 0) {
    return (
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        Per-step breakdown unavailable.{" "}
        <span className="text-amber-700">
          Register <code className="bg-amber-50 px-1 rounded">step</code> as a custom dimension in GA4
          (Admin → Custom definitions → Custom dimensions → Add: Event parameter <code className="bg-amber-50 px-1 rounded">step</code>, scope Event).
        </span>
      </p>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground mb-2">Per-step drop-off</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-1.5 font-medium text-muted-foreground">Step</th>
            <th className="pb-1.5 font-medium text-muted-foreground text-right">Reached</th>
            <th className="pb-1.5 font-medium text-muted-foreground text-right">vs start</th>
            <th className="pb-1.5 font-medium text-muted-foreground text-right">drop-off</th>
          </tr>
        </thead>
        <tbody>
          {quizSteps.map((s, i) => {
            const prev = i === 0 ? quizStart : quizSteps[i - 1].count;
            const dropOff = prev > 0 ? (((prev - s.count) / prev) * 100).toFixed(0) : "—";
            const vsStart = quizStart > 0 ? ((s.count / quizStart) * 100).toFixed(0) : "—";
            return (
              <tr key={s.step} className="border-b border-border/40">
                <td className="py-1.5 text-foreground">{s.step}. {QUIZ_STEP_LABELS[s.step] ?? `Q${s.step}`}</td>
                <td className="py-1.5 text-right">{fmt(s.count)}</td>
                <td className="py-1.5 text-right text-muted-foreground">{vsStart}%</td>
                <td className={`py-1.5 text-right font-medium ${parseInt(dropOff) > 20 ? "text-destructive" : "text-muted-foreground"}`}>
                  {dropOff === "—" ? "—" : `-${dropOff}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
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
  const [needsReauth, setNeedsReauth] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError("");
    setNeedsReauth(false);
    fetch(`/api/analytics?days=${days}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) {
          if (j.code === "GA4_REAUTH_REQUIRED") {
            if (!cancel) setNeedsReauth(true);
            return null;
          }
          throw new Error(j.error ?? r.statusText);
        }
        return j as Traffic;
      })
      .then((j) => { if (!cancel && j) setData(j); })
      .catch((e: Error) => { if (!cancel) setError(e.message); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [days, accessToken]);

  const labels: Record<typeof days, string> = { 1: "Today", 7: "7 days", 30: "30 days", 365: "1 year" };
  // Gate conversion: how many who started the quiz reached the email gate
  const gateConversionRate = data && data.funnel.quiz_start > 0
    ? ((data.funnel.quiz_complete / data.funnel.quiz_start) * 100).toFixed(1)
    : "0";
  // Email/gate rate: of those who saw the gate, how many submitted email
  const emailGateRate = data && data.funnel.quiz_complete > 0
    ? ((data.funnel.email_capture / data.funnel.quiz_complete) * 100).toFixed(1)
    : "0";
  // Overall capture rate: emails submitted / quiz started (true end-to-end rate)
  const overallCaptureRate = data && data.funnel.quiz_start > 0
    ? ((data.funnel.email_capture / data.funnel.quiz_start) * 100).toFixed(1)
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

      {needsReauth && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm text-amber-800 space-y-2">
            <p className="font-semibold">⚠️ Google Analytics reconnection required</p>
            <p>The refresh token has expired or been revoked (most likely: OAuth app is still in <strong>Testing</strong> mode — tokens expire after 7 days).</p>
            <p className="font-medium">To fix:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Run <code className="bg-amber-100 px-1 rounded">node scripts/analytics.mjs</code> locally — it will open a browser login and save a new token to <code className="bg-amber-100 px-1 rounded">.ga4-token.json</code></li>
              <li>Copy the new <code className="bg-amber-100 px-1 rounded">refresh_token</code> value from <code className="bg-amber-100 px-1 rounded">.ga4-token.json</code></li>
              <li>Update <code className="bg-amber-100 px-1 rounded">GA4_REFRESH_TOKEN</code> in Vercel → Settings → Environment Variables</li>
              <li>Redeploy (or wait for next deploy)</li>
            </ol>
            <p className="text-amber-600 text-xs mt-1">Permanent fix: publish the OAuth app (move from Testing → Production in Google Cloud Console) so tokens never expire.</p>
          </CardContent>
        </Card>
      )}

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
                    { label: "Quiz starts",    n: data.funnel.quiz_start },
                    { label: "Quiz completes", n: data.funnel.quiz_complete },
                    { label: "Email captures", n: data.funnel.email_capture },
                    { label: "Skips",          n: data.funnel.quiz_skip },
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
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Gate conversion</p>
                    <p className="text-lg font-bold text-foreground">{gateConversionRate}%</p>
                    <p className="text-[10px] text-muted-foreground/70">complete / start</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email / gate</p>
                    <p className="text-lg font-bold text-foreground">{emailGateRate}%</p>
                    <p className="text-[10px] text-muted-foreground/70">capture / complete</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overall capture</p>
                    <p className="text-lg font-bold text-accent">{overallCaptureRate}%</p>
                    <p className="text-[10px] text-muted-foreground/70">capture / start</p>
                  </div>
                </div>
                <QuizFunnelDetail quizSteps={data.quizSteps} quizStart={data.funnel.quiz_start} />
              </CardContent>
            </Card>
          </div>

          {/* Country map */}
          <CountryMap countries={data.countries} />

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

// ── Storage health banner ─────────────────────────────────────────────────────
// Compares Supabase lead count vs GA4 email_capture events over all time (365d).
// A gap means some submissions failed to persist to the database.
function StorageHealthBanner({ supabaseCount, accessToken }: { supabaseCount: number; accessToken: string }) {
  const [ga4Captures, setGa4Captures] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/analytics?days=365", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (j?.funnel) setGa4Captures(j.funnel.email_capture); })
      .catch(() => {});
  }, [accessToken]);

  if (ga4Captures === null) return null;

  const gap = ga4Captures - supabaseCount;
  if (gap <= 0) {
    return (
      <p className="text-xs text-muted-foreground">
        ✅ Storage health: {supabaseCount} leads in DB · {ga4Captures} GA4 email_capture events — <span className="text-accent font-medium">in sync</span>
      </p>
    );
  }
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4 text-sm text-amber-800">
        ⚠️ <span className="font-semibold">Storage gap detected:</span> GA4 recorded <strong>{ga4Captures}</strong> email captures but only <strong>{supabaseCount}</strong> leads are in the database ({gap} missing). Check Supabase RLS policies and browser console for <code className="bg-amber-100 px-1 rounded">submission_failed</code> events in GA4.
      </CardContent>
    </Card>
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
        <StorageHealthBanner supabaseCount={leads.length} accessToken={session.access_token} />

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
