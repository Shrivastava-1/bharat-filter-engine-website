import { Link } from "react-router-dom";
import { SITE } from "@/data/site";

const EXTERNAL_LINKS = [
  { label: "GitHub", href: SITE.repoUrl },
  { label: "Issue tracker", href: SITE.issuesUrl },
  { label: "Changelog (GitHub)", href: SITE.changelogUrl },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{SITE.name}</p>
          <p className="mt-1 max-w-sm">Open-source filtering for Rails ActiveRecord. Released under the {SITE.license} License.</p>
          <p className="mt-2 text-xs text-slate-500">Unofficial community documentation site; the gem source is the source of truth.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link to="/docs" className="hover:text-indigo-500">Documentation</Link></li>
          <li><Link to="/examples" className="hover:text-indigo-500">Examples</Link></li>
          {EXTERNAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
