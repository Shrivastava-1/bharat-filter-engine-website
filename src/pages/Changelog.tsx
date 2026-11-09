import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/data/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const RELEASES = [
  { version: "0.2.0pre", date: "Unreleased", tone: "prerelease" as const, items: [
    "Added numeric :between range filtering for :integer and :float.",
    "Added :presence filtering (string/text treat NULL and '' as blank).",
    "Added negate: true for string, array, boolean and exact integer/float filters.",
    "Added filter_term and filter_limit for dynamic filter values.",
    "Fixed association filtering when two associations point at the same table.",
    "Fixed field-based search treating an unresolved AND group as unmatchable.",
    "Fixed search so %, _ and backslash are literal characters.",
  ] },
  { version: "0.1.1", date: "2026-08-19", tone: "released" as const, items: [
    "Search no longer silently ignores an AND group with an unknown field.",
    "Extracted a shared apply_condition helper; reuse a single AssociationResolver.",
  ] },
  { version: "0.1.0", date: "2026-08-19", tone: "released" as const, items: [
    "Initial release: string, array, boolean, integer, float, numeric range (gte/lte), date range, nested, multi-level nested search, AND/OR search, dynamic filter values, legacy configuration.",
  ] },
];

export function Changelog() {
  useDocumentTitle("Changelog", "Version history for Bharat Filter Engine.");
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Changelog</h1>
      <p className="mt-2">A condensed summary of CHANGELOG.md. See the <a className="text-indigo-600 underline" href={SITE.changelogUrl} target="_blank" rel="noopener noreferrer">full file on GitHub</a>.</p>
      {RELEASES.map((release) => (
        <article key={release.version} className="mt-8">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-900 dark:text-white">{release.version} <Badge tone={release.tone}>{release.date}</Badge></h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">{release.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      ))}
    </section>
  );
}
