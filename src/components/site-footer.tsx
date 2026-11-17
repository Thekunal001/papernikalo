import { asOfLabel, siteName } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e4d8c4]">
      <p className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-[#6b6258] sm:px-8">
        {siteName} · listings as of {asOfLabel}. Sample data only.
      </p>
    </footer>
  );
}
