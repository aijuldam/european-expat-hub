/**
 * GET /api/analytics?days=7
 *
 * Server-side proxy to GA4 Data API. Returns KPIs, channels, top pages, and
 * quiz funnel for the requested timeframe. Caller must be the admin user
 * (verified via Supabase access token).
 *
 * Required env vars (set in Vercel project settings):
 *   GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN  — OAuth Desktop creds
 *   GA4_PROPERTY_ID                                      — numeric GA4 property
 *   SUPABASE_URL, SUPABASE_ANON_KEY                      — for JWT verification
 *   ADMIN_EMAIL                                          — only this email allowed
 */

"use strict";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA4_BASE = "https://analyticsdata.googleapis.com/v1beta/properties";

// In-memory access token cache (reused across warm lambda invocations)
let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 30_000) return cachedToken;

  const body = new URLSearchParams({
    client_id: process.env.GA4_CLIENT_ID,
    client_secret: process.env.GA4_CLIENT_SECRET,
    refresh_token: process.env.GA4_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`GA4 auth: ${json.error_description || json.error || res.statusText}`);

  cachedToken = json.access_token;
  cachedTokenExpiresAt = Date.now() + (json.expires_in || 3600) * 1000;
  return cachedToken;
}

async function ga4(token, body) {
  const res = await fetch(`${GA4_BASE}/${process.env.GA4_PROPERTY_ID}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`GA4: ${json.error && json.error.message || res.statusText}`);
  return json;
}

async function verifyAdmin(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: process.env.SUPABASE_ANON_KEY },
  });
  if (!res.ok) return false;
  const user = await res.json();
  return user && user.email === process.env.ADMIN_EMAIL;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const isAdmin = await verifyAdmin(req.headers.authorization);
    if (!isAdmin) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const days = Math.max(1, Math.min(365, parseInt(req.query.days, 10) || 7));
    const startDate = days === 1 ? "today" : `${days}daysAgo`;
    const dateRanges = [{ startDate, endDate: "today" }];

    const token = await getAccessToken();

    const [overview, pages, channels, funnel] = await Promise.all([
      ga4(token, {
        dateRanges,
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
      }),
      ga4(token, {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      ga4(token, {
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
      ga4(token, {
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: ["quiz_start", "quiz_step", "quiz_complete", "email_capture", "quiz_skip"],
            },
          },
        },
      }),
    ]);

    const ov = (overview.rows && overview.rows[0] && overview.rows[0].metricValues) || [];
    const num = (i) => parseFloat((ov[i] && ov[i].value) || "0");

    const funnelCounts = {};
    (funnel.rows || []).forEach((r) => {
      funnelCounts[r.dimensionValues[0].value] = parseInt(r.metricValues[0].value, 10);
    });

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({
      days,
      kpi: {
        sessions: Math.round(num(0)),
        users: Math.round(num(1)),
        pageviews: Math.round(num(2)),
        bounceRate: num(3),
        avgSessionSec: num(4),
      },
      pages: (pages.rows || []).map((r) => ({
        path: r.dimensionValues[0].value,
        views: parseInt(r.metricValues[0].value, 10),
        users: parseInt(r.metricValues[1].value, 10),
      })),
      channels: (channels.rows || []).map((r) => ({
        channel: r.dimensionValues[0].value,
        sessions: parseInt(r.metricValues[0].value, 10),
        users: parseInt(r.metricValues[1].value, 10),
      })),
      funnel: {
        quiz_start: funnelCounts.quiz_start || 0,
        quiz_step: funnelCounts.quiz_step || 0,
        quiz_complete: funnelCounts.quiz_complete || 0,
        email_capture: funnelCounts.email_capture || 0,
        quiz_skip: funnelCounts.quiz_skip || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
};
