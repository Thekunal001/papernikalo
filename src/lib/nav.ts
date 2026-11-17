export const tabs = [
  {
    href: "/tools",
    label: "Tools",
    summary: "Prepare photos, signatures, and documents for application forms.",
  },
  {
    href: "/practice",
    label: "Practice",
    summary: "Work through sample questions for central and state exams.",
  },
  {
    href: "/jobs",
    label: "Jobs",
    summary: "Browse sample openings from boards across India.",
  },
  {
    href: "/notifications",
    label: "Notifications",
    summary: "See sample admit cards, results, and last-date alerts.",
  },
] as const;

export const publicPaths = ["/", ...tabs.map((tab) => tab.href)] as const;

export type TabHref = (typeof tabs)[number]["href"];

export function tabByHref(href: TabHref) {
  const tab = tabs.find((item) => item.href === href);
  if (!tab) {
    throw new Error(`Missing tab ${href}`);
  }
  return tab;
}
