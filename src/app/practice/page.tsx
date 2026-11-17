import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { practiceSets, sampleQuestion } from "@/lib/content";
import { tabByHref } from "@/lib/nav";

const tab = tabByHref("/practice");

export const metadata: Metadata = {
  title: tab.label,
  description: tab.summary,
};

export default function PracticePage() {
  return (
    <PageFrame title={tab.label} summary={tab.summary}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {practiceSets.map((set) => (
          <li
            key={set.exam}
            className="rounded-lg border border-[#e4d8c4] bg-[#fbf7f0] px-4 py-4"
          >
            <h2 className="font-medium">{set.exam}</h2>
            <p className="mt-2 text-sm leading-6 text-[#57534e]">
              {set.level} · {set.questions} questions · {set.papers}{" "}
              {set.papers === 1 ? "paper" : "papers"}
            </p>
          </li>
        ))}
      </ul>

      <article className="mt-6 rounded-lg border border-[#e4d8c4] bg-[#fffdf8] px-4 py-5 sm:px-5">
        <p className="text-sm font-medium text-[#9a3412]">Sample question</p>
        <h2 className="mt-2 text-lg font-medium leading-7">
          {sampleQuestion.prompt}
        </h2>
        <ol className="mt-4 grid gap-2">
          {sampleQuestion.options.map((option, index) => {
            const correct = index === sampleQuestion.answerIndex;
            return (
              <li
                key={option}
                className={
                  correct
                    ? "flex items-center justify-between gap-3 rounded-md border border-[#9a3412] bg-[#f4efe6] px-3 py-2"
                    : "flex items-center gap-3 rounded-md border border-[#e4d8c4] px-3 py-2"
                }
              >
                <span>
                  <span className="mr-2 font-mono text-sm text-[#6b6258]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
                {correct ? (
                  <span className="text-sm font-medium text-[#9a3412]">
                    Answer
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-sm leading-6 text-[#57534e]">
          {sampleQuestion.explanation}
        </p>
      </article>
    </PageFrame>
  );
}
