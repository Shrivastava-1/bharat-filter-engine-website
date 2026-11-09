import { Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { DocsLayout } from "@/layouts/DocsLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { Changelog } from "@/pages/Changelog";
import { DocPage } from "@/pages/Docs/DocPage";
import { Examples } from "@/pages/Examples";
import { Features } from "@/pages/Features";
import { Home } from "@/pages/Home";
import { Playground } from "@/pages/Playground";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="docs" element={<DocsLayout />}>
            <Route index element={<Navigate to="introduction" replace />} />
            <Route path=":slug" element={<DocPage />} />
          </Route>
          <Route path="examples" element={<Examples />} />
          <Route path="playground" element={<Playground />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="*" element={<PlaceholderPage title="Page not found" phase={0} />} />
        </Route>
      </Routes>
    </>
  );
}
