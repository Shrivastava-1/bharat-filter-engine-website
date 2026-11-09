import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import type { Feature, FeatureSince } from "@/data/features";

const SINCE_LABEL: Record<FeatureSince, string> = {
  "0.1.0": "Since 0.1.0",
  "0.2.0pre": "New in 0.2.0pre (unreleased)",
  unlisted: "In source (version not itemised)",
};

export function FeatureCard({ feature, expanded = false }: { feature: Feature; expanded?: boolean }) {
  const Icon = feature.icon;
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <Badge tone={feature.since === "0.2.0pre" ? "prerelease" : "neutral"}>{SINCE_LABEL[feature.since]}</Badge>
      </div>
      <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
      <p className="mt-1 text-sm">{feature.summary}</p>
      {expanded && (
        <>
          <CodeBlock code={feature.example} />
          <p className="text-sm"><strong>Limitation:</strong> {feature.limitation}</p>
        </>
      )}
      <Link to={feature.docPath} className="mt-auto pt-3 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
        Read the docs &rarr;
      </Link>
    </article>
  );
}
