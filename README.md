# Bharat Filter Engine website

Documentation and showcase site for the `bharat_filter_engine` Ruby gem.
Stack: React, Vite, TypeScript, Tailwind CSS, React Router.

    npm install
    npm run dev        # development server
    npm run build      # type-check + production build

Status: all planned pages implemented (see SOURCE_AUDIT.md for verified behavior and open issues).
The gem source is the source of truth; see SOURCE_AUDIT.md for verified behavior and open issues.

## Deployment (GitHub Pages)

The site deploys automatically from `main` via `.github/workflows/deploy.yml`.
It is served from `/bharat-filter-engine-website/` (set in `vite.config.ts` as `base`; the
router `basename` is derived from it). If you rename the repository, change `base` only.
`npm run build` also writes `dist/404.html`, a copy of `index.html`, so deep links and
refreshes work on GitHub Pages.
