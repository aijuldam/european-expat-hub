/**
 * Expatlix — GA4 traffic snapshot
 * Usage:  node scripts/analytics.mjs
 *         node scripts/analytics.mjs --days 7
 *
 * Requires:
 *   1. A Google service-account key saved at .ga4-credentials.json (never committed)
 *   2. The GA4 property ID in .ga4-property  (one line, e.g. "123456789")
 *   3. The service account must have "Viewer" access in GA4 → Admin → Property access
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = new URL("..", import.meta.url).pathname;

// ── Config ────────────────────────────────────────────────────────────────────
const CREDS_FILE    = resolve(ROOT, ".ga4-credentials.json");
const PROPERTY_FILE = resolve(ROOT, ".ga4-property");

function die(msg) {
  console.error("\n❌  " + msg + "\n");
  process.exit(1);
}

if (!existsSync(CREDS_FILE)) {
  die(
    `.ga4-credentials.json not found.\n\n` +
    `   1. Go to console.cloud.google.com → IAM & Admin → Service Accounts\n` +
    `   2. Create a service account, grant it no project-level roles\n` +
    `   3. Add a JSON key and download it\n` +
    `   4. Save it as .ga4-credentials.json in the project root\n` +
    `   5. In GA4 → Admin → Property Access Management, add the service account\n` +
    `      email with the "Viewer" role`
  );
}

if (!existsSync(PROPERTY_FILE)) {
  die(
    `.ga4-property not found.\n\n` +
    `   Create a file called .ga4-property in the project root containing\n` +
    `   only your GA4 numeric property ID (found in GA4 → Admin → Property Settings).\n` +
    `   Example:  echo "123456789" > .ga4-property`
  );
}

const propertyId = readFileSync(PROPERTY_FILE, "utf8").trim();
if (!/^\d+$/.test(propertyId)) die(".ga4-property must contain only digits.");

// ── Parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const daysIdx = args.indexOf("--days");
const days = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) || 1 : 1;
const startDate = days === 1 ? "today" : `${days}daysAgo`;
const label = days === 1 ? "Today" : `Last ${days} days`;

// ── GA4 client ────────────────────────────────────────────────────────────
const analytics = new BetaAnalyticsDataClient({
  keyFilename: CREDS_FILE,
});

async function run() {
  console.log(`\n📊  Expatlix Analytics — ${label}\n`);

  // ── Overview: sessions, users, pageviews, bounce rate ────────────────────
  const [overview] = await analytics.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate: "today" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  });

  const row = overview.rows?.[0]?.metricValues ?? [];
  const sessions  = parseInt(row[0]?.value ?? "0");
  const users     = parseInt(row[1]?.value ?? "0");
  const pageviews = parseInt(row[2]?.value ?? "0");
  const bounce    = parseFloat(row[3]?.value ?? "0") * 100;
  const avgSec    = parseFloat(row[4]?.value ?? "0");
  const avgMin    = Math.floor(avgSec / 60);
  const avgRemSec = Math.round(avgSec % 60);

  console.log("  Sessions          " + fmt(sessions));
  console.log("  Active users      " + fmt(users));
  console.log("  Page views        " + fmt(pageviews));
  console.log("  Bounce rate       " + bounce.toFixed(1) + "%");
  console.log(`  Avg session       ${avgMin}m ${avgRemSec}s`);

  // ── Top 10 pages ──────────────────────────────────────────────────────────
  const [pages] = await analytics.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  console.log("\n  Top pages\n  " + "─".repeat(50));
  for (const r of pages.rows ?? []) {
    const path  = r.dimensionValues[0].value.padEnd(40, " ");
    const views = fmt(parseInt(r.metricValues[0].value));
    console.log(`  ${path} ${views} views`);
  }

  // ── Traffic sources ───────────────────────────────────────────────────────
  const [sources] = await analytics.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 8,
  });

  console.log("\n  Traffic sources\n  " + "─".repeat(40));
  for (const r of sources.rows ?? []) {
    const channel = r.dimensionValues[0].value.padEnd(30, " ");
    const s = fmt(parseInt(r.metricValues[0].value));
    console.log(`  ${channel} ${s}`);
  }

  // ── Countries ─────────────────────────────────────────────────────────────
  const [countries] = await analytics.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 8,
  });

  console.log("\n  Top countries\n  " + "─".repeat(40));
  for (const r of countries.rows ?? []) {
    const country = r.dimensionValues[0].value.padEnd(30, " ");
    const u = fmt(parseInt(r.metricValues[0].value));
    console.log(`  ${country} ${u}`);
  }

  console.log("\n  ─────────────────────────────────────────\n");
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

run().catch((err) => {
  console.error("\n❌  GA4 API error:", err.message);
  process.exit(1);
});
