import { Helmet } from "react-helmet-async";
import type { RouteSeo } from "@/routes";
import { SITE } from "@/routes";

/**
 * Renders per-route <head> tags via react-helmet-async.
 * Works in both SSR (prerender) and client contexts — Helmet reconciles them.
 */
export function SeoHead({ seo, path }: { seo: RouteSeo; path: string }) {
  const canonical = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      {seo.schema && (
        <script type="application/ld+json">{JSON.stringify(seo.schema)}</script>
      )}
    </Helmet>
  );
}
