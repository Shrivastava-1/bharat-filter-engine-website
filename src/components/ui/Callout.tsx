import type { ReactNode } from "react";
import { AlertTriangle, FlaskConical, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * - info:       neutral note.
 * - warning:    behavior confirmed by reading the source that can surprise users.
 * - unverified: suspected issue NOT yet confirmed by running the gem or its specs.
 */
export type CalloutKind = "info" | "warning" | "unverified";

const STYLES: Record<CalloutKind, { icon: LucideIcon; box: string; label: string }> = {
  info: {
    icon: Info,
    box: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200",
    label: "Note",
  },
  warning: {
    icon: AlertTriangle,
    box: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    label: "Warning (confirmed from source)",
  },
  unverified: {
    icon: FlaskConical,
    box: "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200",
    label: "Needs runtime testing",
  },
};

export function Callout({ kind = "info", title, children }: { kind?: CalloutKind; title?: string; children: ReactNode }) {
  const { icon: Icon, box, label } = STYLES[kind];
  return (
    <aside className={cn("my-4 flex gap-3 rounded-xl border p-4 text-sm", box)} role="note">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title ?? label}</p>
        <div className="mt-1 space-y-2">{children}</div>
      </div>
    </aside>
  );
}
