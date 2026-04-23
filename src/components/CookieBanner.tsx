import { useEffect, useState } from "react";

const EU_COUNTRIES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GR",
  "HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO",
  "SE","SI","SK", // EU-27
  "IS","LI","NO", // EEA
  "GB",           // UK (GDPR still enforced)
]);

const STORAGE_KEY = "expatlix_cookie_consent";

function updateConsent(granted: boolean) {
  if (typeof window.gtag !== "function") return;
  const val = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: val,
    ad_storage: "denied",         // never grant ads
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "accepted") { updateConsent(true); return; }
    if (saved === "rejected") { updateConsent(false); return; }

    // No prior choice — check country via IP
    fetch("https://api.country.is/")
      .then((r) => r.json())
      .then(({ country }: { country: string }) => {
        if (EU_COUNTRIES.has(country)) {
          setVisible(true);         // EU: show banner, GA stays denied
        } else {
          updateConsent(true);      // non-EU: grant silently, no banner
        }
      })
      .catch(() => setVisible(true)); // on error: show banner (safe default)
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    updateConsent(true);
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    updateConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background border-t border-border px-4 py-3 shadow-md sm:px-8">
      <p className="text-sm text-muted-foreground max-w-xl">
        We use analytics cookies to understand how visitors use Expatlix — no personal data is
        collected or shared.{" "}
        <a href="/methodology" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Learn more
        </a>
        .
      </p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={reject}
          className="rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Reject
        </button>
        <button
          onClick={accept}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
