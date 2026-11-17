import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { jobs } from "@/lib/content";
import { tabByHref } from "@/lib/nav";

const tab = tabByHref("/jobs");

export const metadata: Metadata = {
  title: tab.label,
  description: tab.summary,
};

export default function JobsPage() {
  return (
    <PageFrame title={tab.label} summary={tab.summary}>
      <ul className="grid gap-4">
        {jobs.map((job) => (
          <li
            key={job.title}
            className="rounded-lg border border-[#e4d8c4] bg-[#fbf7f0] px-4 py-4 sm:px-5"
          >
            <p className="text-sm text-[#6b6258]">{job.org}</p>
            <h2 className="mt-1 text-lg font-medium">{job.title}</h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-[#6b6258]">Place</dt>
                <dd>{job.place}</dd>
              </div>
              <div>
                <dt className="text-[#6b6258]">Qualification</dt>
                <dd>{job.qualification}</dd>
              </div>
              <div>
                <dt className="text-[#6b6258]">Vacancies</dt>
                <dd>{job.vacancies}</dd>
              </div>
              <div>
                <dt className="text-[#6b6258]">Last date</dt>
                <dd className="font-mono">{job.lastDate}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
