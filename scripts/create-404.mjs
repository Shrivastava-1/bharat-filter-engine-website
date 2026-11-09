// GitHub Pages cannot rewrite unknown URLs to index.html, but it serves
// 404.html for any path that has no file. Because this site is a single-page
// app, 404.html can simply be a copy of index.html: the browser keeps the
// requested URL and React Router renders the matching route.
import { copyFileSync, existsSync } from "node:fs";

const indexPath = "dist/index.html";
if (!existsSync(indexPath)) {
  console.error("dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}
copyFileSync(indexPath, "dist/404.html");
console.log("Created dist/404.html (SPA fallback for GitHub Pages)");
