export function PageFrame({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 sm:px-8 sm:py-16">
      <header className="border-t-2 border-b-[6px] border-[#1c1917] py-8">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#57534e]">
          {summary}
        </p>
      </header>
      <div className="mt-8">{children}</div>
    </main>
  );
}
