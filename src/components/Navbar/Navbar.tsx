import { useState } from "react";
import { Github, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { MAIN_NAV } from "@/data/navigation";
import { SITE } from "@/data/site";
import { cn } from "@/utils/cn";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "text-indigo-600 dark:text-indigo-400"
      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white" onClick={closeMenu}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-7 w-7" />
          {SITE.name}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" href={SITE.repoUrl} className="hidden sm:inline-flex">
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <ThemeToggle />
          <Button to="/docs/installation" className="hidden sm:inline-flex">
            Get Started
          </Button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 px-4 py-3 lg:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            {MAIN_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass} onClick={closeMenu}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button to="/docs/installation" className="flex-1">Get Started</Button>
            <Button variant="secondary" href={SITE.repoUrl} className="flex-1">GitHub</Button>
          </div>
        </div>
      )}
    </header>
  );
}
