import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "neutral" | "prerelease" | "released";

const TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  prerelease: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  released: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", TONES[tone])}>
      {children}
    </span>
  );
}
