export const CONSENT_TEXT =
  "I agree to receive personalised tips, city guides and news from European Expat Hub. You can unsubscribe at any time.";

export const CONSENT_VERSION = "2026-04-19-v1";

const STORAGE_KEY = "eeh_leads";

export interface Lead {
  id: string;
  email: string;
  ipAddress: string;
  consentTimestamp: string; // ISO-8601
  sourceUrl: string;
  marketingOptIn: boolean;
  consentText: string;
  consentVersion: string;
  quizTopMatch: string;
  quizTopMatchPct: number;
  quizAnswers: Record<string, string | string[]>;
}

/** Persist a lead to localStorage (and optionally POST to a webhook). */
export function saveLead(lead: Omit<Lead, "id">): Lead {
  const full: Lead = {
    ...lead,
    id: crypto.randomUUID(),
  };

  try {
    const existing: Lead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    existing.push(full);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Silently ignore storage errors (private browsing quota, etc.)
  }

  // Optional webhook forwarding (Zapier / Make / Airtable)
  const webhookUrl = import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(full),
    }).catch(() => {
      // Fire-and-forget — never block the UX on webhook failures
    });
  }

  return full;
}

/** Retrieve all stored leads (for export / debugging). */
export function getLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Attempt to resolve the client's public IP via ipify; falls back to "unknown". */
export async function getClientIp(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    return (data as { ip: string }).ip ?? "unknown";
  } catch {
    return "unknown";
  }
}
