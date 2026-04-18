#!/usr/bin/env node
/**
 * Data-QA: warn (and exit 1) if any city's lastReviewed is older than 180 days.
 *
 * Run manually:       node scripts/check-city-data.mjs
 * Run in CI (build):  add to build script or workflow step
 */

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../src/data/cities");
const MAX_AGE_DAYS = 180;
const today = new Date();

let hasStale = false;

const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
  console.error("❌  No JSON files found in src/data/cities/");
  process.exit(1);
}

for (const file of files.sort()) {
  const raw = await readFile(join(DATA_DIR, file), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error(`❌  ${file}: invalid JSON`);
    hasStale = true;
    continue;
  }

  const { cityId, lastReviewed } = data;
  if (!lastReviewed) {
    console.warn(`⚠️   ${file}: missing lastReviewed field`);
    hasStale = true;
    continue;
  }

  const reviewedAt = new Date(lastReviewed);
  const ageDays = Math.floor((today - reviewedAt) / 86_400_000);

  if (ageDays > MAX_AGE_DAYS) {
    console.warn(
      `⚠️   ${cityId ?? file}: data is ${ageDays} days old (lastReviewed: ${lastReviewed}) — update recommended`
    );
    hasStale = true;
  } else {
    console.log(`✓  ${cityId ?? file}: reviewed ${ageDays} days ago (${lastReviewed})`);
  }
}

if (hasStale) {
  console.error(
    `\n❌  One or more cities have stale data (> ${MAX_AGE_DAYS} days). Update src/data/cities/ and bump lastReviewed.`
  );
  process.exit(1);
} else {
  console.log(`\n✅  All ${files.length} city data files are fresh (≤ ${MAX_AGE_DAYS} days).`);
}
