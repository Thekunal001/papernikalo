"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabs } from "@/lib/nav";
import { siteName } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#e4d8c4]">
      <div className="mx-auto flex w-full max-w-5xl items-baseline justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight sm:text-3xl">
          {siteName}
        </Link>
        <nav aria-label="Primary" className="flex items-baseline gap-x-3 sm:gap-x-5">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-sm font-semibold text-[#1c1917] underline decoration-2 underline-offset-4"
                    : "text-sm font-medium text-[#7c2d12] underline-offset-4 hover:underline"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
