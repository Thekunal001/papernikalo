export const siteName = "PaperNikalo";
export const siteTagline = "Government job notices across India";

/** Fixed reference date so open and closed labels stay static. */
export const asOf = "2026-11-17";
export const asOfLabel = "17 November 2026";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const preview = process.env.VERCEL_URL?.trim();
  const raw =
    explicit ||
    (production ? `https://${production}` : "") ||
    (preview ? `https://${preview}` : "") ||
    "http://localhost:3000";

  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
