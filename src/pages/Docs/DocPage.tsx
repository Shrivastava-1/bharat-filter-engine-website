import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DocBlocks } from "@/components/Docs/DocBlocks";
import { Badge } from "@/components/ui/Badge";
import { DOC_PAGES, findDocPage } from "@/data/docs";
import { CURRENT_VERSION } from "@/data/versions";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function DocPage() {
  const { slug } = useParams();
  const page = findDocPage(slug);
  useDocumentTitle(page ? page.title : "Documentation");

  if (!page) return <Navigate to="/docs/introduction" replace />;

  const index = DOC_PAGES.indexOf(page);
  const previous = DOC_PAGES[index - 1];
  const next = DOC_PAGES[index + 1];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link to="/docs" className="hover:underline">Docs</Link> / {page.section} / {page.title}
      </nav>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{page.title}</h1>
        <Badge tone="prerelease">Source {CURRENT_VERSION.label}</Badge>
      </div>
      <DocBlocks blocks={page.blocks} />
      <div className="mt-12 flex justify-between gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
        {previous ? <Link to={`/docs/${previous.slug}`} className="flex items-center gap-1 hover:text-indigo-500"><ChevronLeft className="h-4 w-4" />{previous.title}</Link> : <span />}
        {next ? <Link to={`/docs/${next.slug}`} className="flex items-center gap-1 hover:text-indigo-500">{next.title}<ChevronRight className="h-4 w-4" /></Link> : <span />}
      </div>
    </>
  );
}
