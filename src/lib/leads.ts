// ============================================================
// LEGAL PLACEHOLDERS — complete before launch
// ============================================================
// 1. Replace PRIVACY_NOTICE_URL with the real URL of your privacy notice.
// 2. Add controller identity to the notice: company name, address, DPO contact.
// 3. Confirm RETENTION_MONTHS against your privacy notice (currently 24 months).
// 4. Decide on IP address collection. Excluded below (data minimisation).
//    If you add it, document the purpose + lawful basis in the privacy notice.
// 5. Wire up unsubscribe links in all marketing emails using unsubscribe_token.
//    On click, call updateLeadMarketingConsent(lead_id, false).
// 6. Before syncing to a CRM, filter to is_marketable === true only.
//    Suppress any records where unsubscribed_at is set.
// 7. Have a qualified EU privacy lawyer review before processing EU personal data.
// ============================================================

export const PRIVACY_NOTICE_VERSION = "2026-04-19-v1";

/** TODO: replace with the real URL once your privacy notice page is live. */
export const PRIVACY_NOTICE_URL = "/privacy";

/**
 * Exact text displayed beside the marketing opt-in checkbox at time of consent.
 * Must match what is stored in marketing_consent_text for audit trail integrity.
 */
export const MARKETING_CONSENT_TEXT =
  "I'd like to receive relocation tips, updates, and promotional emails from European Expat Hub.";

/** Retention period in months — align with your published privacy notice. */
const RETENTION_MONTHS = 24;

const STORAGE_KEY = "eeh_leads";

// ============================================================
// Lead — CRM-ready schema with full GDPR audit fields
//
// Lawful bases:
//   result_processing_lawful_basis = "legitimate_interests"
//     → We have a legitimate interest in generating and storing quiz
//       recommendations that the user actively requested.
//   marketing_lawful_basis = "consent"
//     → Explicit, freely given, specific, informed, unambiguous opt-in
//       via an unchecked checkbox presented separately from the result flow.
// ============================================================
export interface Lead {
  // ── Identification ────────────────────────────────────────
  lead_id: string; // UUID v4

  // ── Contact (all optional — email only if user provides it) ──
  email?: string; // collected only when user explicitly enters it
  // first_name?: string; // TODO: add if quiz collects a name in future

  // ── Quiz data ─────────────────────────────────────────────
  quiz_answers: Record<string, string | string[]>;
  quiz_top_match: string;      // city name of #1 result
  quiz_top_match_pct: number;  // match percentage (0–100)
  quiz_result_snapshot: string; // JSON of top-3 for audit trail

  // ── Lawful basis for result processing ────────────────────
  result_processing_lawful_basis: "legitimate_interests";

  // ── Result delivery ────────────────────────────────────────
  // true when user explicitly requested results be sent by email.
  // Lawful basis for the transactional email: legitimate_interests
  // (delivering what was actively requested by the user).
  result_delivery_requested: boolean;

  // ── Marketing consent — SEPARATE from result processing ───
  // Only set when user explicitly opts in via an unchecked checkbox.
  marketing_consent: boolean;
  marketing_consent_timestamp?: string; // ISO-8601; only when marketing_consent === true
  marketing_consent_text?: string;      // exact text shown at consent time

  // ── Privacy notice audit ──────────────────────────────────
  privacy_notice_version: string; // version of notice shown at submission time
  source_url: string;             // page URL where data was submitted

  // ── IP / user agent ───────────────────────────────────────
  // Excluded by default (data minimisation principle).
  // Uncomment and document purpose + lawful basis before enabling.
  // ip_address?: string;
  // user_agent?: string;

  // ── Timestamps ────────────────────────────────────────────
  created_at: string; // ISO-8601
  updated_at: string; // ISO-8601; refreshed on any mutation

  // ── Retention ─────────────────────────────────────────────
  // Review and delete or anonymise by this date.
  retention_review_date: string; // ISO-8601 date (YYYY-MM-DD)
  deleted_at?: string;           // ISO-8601; set on hard delete
  anonymized_at?: string;        // ISO-8601; set when PII stripped but record kept for stats

  // ── CRM sync ──────────────────────────────────────────────
  // is_marketable: true only when email present, marketing_consent === true,
  //   and unsubscribed_at is not set. Gate all marketing list syncs on this field.
  is_marketable: boolean;
  crm_id?: string;            // back-reference set after first CRM write
  unsubscribe_token?: string; // include in every marketing email as ?token=<value>
  unsubscribed_at?: string;   // ISO-8601; set when user withdraws marketing consent
}

// ── Internal helpers ──────────────────────────────────────────

function retentionReviewDate(from: Date): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + RETENTION_MONTHS);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function readAll(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Silently ignore storage errors (private browsing quota, etc.)
  }
}

function forward(lead: Lead): void {
  const webhookUrl = import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) return;
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  }).catch(() => {
    // Fire-and-forget — never block the UX on webhook failures
  });
}

// ── Public API ────────────────────────────────────────────────

/**
 * Persist a quiz lead to localStorage and optionally forward via webhook.
 *
 * CRM sync note: only records where is_marketable === true should be added
 * to marketing lists. Suppress records where unsubscribed_at is set.
 */
export function saveLead(
  lead: Omit<Lead, "lead_id" | "created_at" | "updated_at" | "retention_review_date" | "is_marketable">
): Lead {
  const now = new Date();
  const full: Lead = {
    ...lead,
    lead_id: crypto.randomUUID(),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    retention_review_date: retentionReviewDate(now),
    // is_marketable: true only when email exists AND explicit marketing consent
    is_marketable: !!(lead.email && lead.marketing_consent),
    // Generate unsubscribe token only when marketable
    unsubscribe_token:
      !!(lead.email && lead.marketing_consent) ? crypto.randomUUID() : undefined,
  };

  const existing = readAll();
  existing.push(full);
  writeAll(existing);
  forward(full);

  return full;
}

/**
 * Update the marketing consent status for an existing lead.
 * Call this when a user clicks an unsubscribe link or withdraws consent.
 *
 * CRM sync note: after calling this, set the CRM contact's email_opt_in = false
 * and move them to suppression list before next send.
 */
export function updateLeadMarketingConsent(lead_id: string, granted: boolean): void {
  const leads = readAll();
  const idx = leads.findIndex((l) => l.lead_id === lead_id);
  if (idx === -1) return;

  const now = new Date().toISOString();
  leads[idx] = {
    ...leads[idx],
    marketing_consent: granted,
    marketing_consent_timestamp: granted ? now : leads[idx].marketing_consent_timestamp,
    is_marketable: granted && !!leads[idx].email,
    unsubscribed_at: !granted ? now : leads[idx].unsubscribed_at,
    updated_at: now,
  };
  writeAll(leads);
}

/** Retrieve all stored leads (for export / debugging / retention review). */
export function getLeads(): Lead[] {
  return readAll();
}
