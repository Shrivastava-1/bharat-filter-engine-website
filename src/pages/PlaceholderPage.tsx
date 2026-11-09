import { Badge } from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface PlaceholderPageProps {
  title: string;
  phase: number;
}

export function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  useDocumentTitle(title);
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <Badge tone="prerelease">Planned: Phase {phase}</Badge>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-3">This page has not been built yet.</p>
    </section>
  );
}
