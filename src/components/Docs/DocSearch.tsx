import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { searchDocs } from "@/data/docs";

export function DocSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = searchDocs(query);

  function open(slug: string) {
    setQuery("");
    onNavigate?.();
    navigate(`/docs/${slug}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (results[0]) open(results[0].slug);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && setQuery("")}
        placeholder="Search docs (Enter opens first result)"
        aria-label="Search documentation"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      {query && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 && <li className="px-3 py-2 text-sm">No results</li>}
          {results.map((page) => (
            <li key={page.slug}>
              <Link to={`/docs/${page.slug}`} onClick={() => open(page.slug)} className="block rounded px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                {page.title} <span className="text-xs text-slate-500">{page.section}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
