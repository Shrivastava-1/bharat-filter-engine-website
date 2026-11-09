import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { DocSearch } from "@/components/Docs/DocSearch";
import { DOC_PAGES } from "@/data/docs";
import { cn } from "@/utils/cn";

const SECTIONS = Array.from(new Set(DOC_PAGES.map((page) => page.section)));

export function DocsLayout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[16rem_1fr]">
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-medium lg:hidden"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="h-4 w-4" /> Documentation menu
      </button>

      <aside className={cn("space-y-6 lg:block", open ? "block" : "hidden")} aria-label="Documentation">
        <DocSearch onNavigate={close} />
        {SECTIONS.map((section) => (
          <div key={section}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{section}</p>
            <ul className="space-y-1">
              {DOC_PAGES.filter((page) => page.section === section).map((page) => (
                <li key={page.slug}>
                  <NavLink
                    to={`/docs/${page.slug}`}
                    onClick={close}
                    className={({ isActive }) =>
                      cn("block rounded-md px-3 py-1.5 text-sm", isActive
                        ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800")
                    }
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <article className="min-w-0 max-w-3xl">
        <Outlet />
      </article>
    </div>
  );
}
