import { useEffect } from "react";
import { SITE } from "@/data/site";

/** Sets a page-specific <title> and meta description. */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`;
    if (description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
    }
  }, [title, description]);
}
