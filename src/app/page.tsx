import type { Metadata } from "next";
import Link from "next/link";
import {
  governmentJobNames,
  governmentJobs,
  jobs,
  notifications,
  practiceSets,
  tools,
} from "@/lib/content";
import { tabs } from "@/lib/nav";
import { siteName, siteTagline } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: siteName },
  description: `${siteTagline}. ${governmentJobNames.join(", ")}.`,
  keywords: governmentJobNames,
};

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 sm:px-8 sm:py-16">
      <section className="border-t-2 border-b-[6px] border-[#1c1917] py-8">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium tracking-[0.16em] text-[#9a3412] uppercase">
          <li>{governmentJobNames.length} job names</li>
          <li>{jobs.length} openings</li>
          <li>{notifications.length} alerts</li>
          <li>{practiceSets.length} practice sets</li>
          <li>{tools.length} tools</li>
        </ul>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
          {siteTagline}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#57534e]">
          Sample listings for central and state exams. Vacancies and dates on
          this site are placeholders. A linked job name opens the official site
          for that exam.
        </p>
      </section>

      <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#e4d8c4] bg-[#e4d8c4] sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.href} className="bg-[#fbf7f0]">
            <Link
              href={tab.href}
              className="block h-full px-4 py-4 transition-colors hover:bg-[#fffdf8]"
            >
              <p className="font-medium">{tab.label}</p>
              <p className="mt-1 text-sm leading-6 text-[#57534e]">{tab.summary}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="government-jobs" className="pt-16">
        <h2
          id="government-jobs"
          className="text-2xl font-semibold tracking-tight"
        >
          Government jobs
        </h2>
        <p className="mt-2 max-w-2xl text-[#57534e]">
          {governmentJobNames.length} central and state recruitment names.
          Underlined names open the official site.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {governmentJobs.map((group) => (
            <section
              key={group.group}
              aria-labelledby={group.group.toLowerCase().replaceAll(" ", "-")}
            >
              <h3
                id={group.group.toLowerCase().replaceAll(" ", "-")}
                className="text-sm font-semibold text-[#9a3412]"
              >
                {group.group}
              </h3>
              <ul className="mt-3 columns-2 gap-x-6">
                {group.jobs.map((job) => (
                  <li
                    key={job.name}
                    className="break-inside-avoid py-1 text-sm leading-6"
                  >
                    {job.href ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-[#c4b5a0] underline-offset-4 hover:decoration-[#9a3412]"
                      >
                        {job.name}
                      </a>
                    ) : (
                      job.name
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
