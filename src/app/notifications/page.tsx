import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { notifications } from "@/lib/content";
import { tabByHref } from "@/lib/nav";

const tab = tabByHref("/notifications");

export const metadata: Metadata = {
  title: tab.label,
  description: tab.summary,
};

export default function NotificationsPage() {
  return (
    <PageFrame title={tab.label} summary={tab.summary}>
      <ul className="divide-y divide-[#e4d8c4] border-y border-[#e4d8c4]">
        {notifications.map((item) => (
          <li
            key={item.title}
            className="grid gap-2 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
          >
            <p className="text-sm font-medium text-[#9a3412]">{item.kind}</p>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-medium">{item.title}</h2>
                <time className="font-mono text-sm text-[#6b6258]">{item.date}</time>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#57534e]">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
