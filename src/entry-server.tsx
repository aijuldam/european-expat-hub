/**
 * SSR entry point — loaded by scripts/prerender.mjs via Vite's ssrLoadModule.
 * Renders the full app at a given path and returns the HTML + Helmet context.
 *
 * wouter's memoryLocation uses useSyncExternalStore without getServerSnapshot,
 * which React 19 rejects in renderToString. We supply our own static hook that
 * provides getServerSnapshot so React 19 is satisfied.
 */
import { useSyncExternalStore } from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import App from "./App";

/** A wouter-compatible location hook that works in React 19 SSR. */
function makeStaticHook(fullPath: string) {
  return () =>
    [
      useSyncExternalStore(
        () => () => {},   // subscribe: no-op (static render, never changes)
        () => fullPath,   // getSnapshot
        () => fullPath,   // getServerSnapshot — required by React 19 renderToString
      ),
      () => {},           // navigate: no-op during SSR
    ] as [string, () => void];
}

export async function render(path: string) {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  const fullPath = base + path;           // wouter strips base → route matches correctly
  const helmetContext = {} as FilledContext;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App locationHook={makeStaticHook(fullPath)} />
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet };
}
