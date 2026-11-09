import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  /** Internal route. */
  to?: string;
  /** External URL (opens in a new tab). */
  href?: string;
  onClick?: () => void;
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500",
  secondary:
    "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

/** Renders a router Link, an external anchor, or a button depending on props. */
export function Button({ children, variant = "primary", to, href, onClick, className }: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
