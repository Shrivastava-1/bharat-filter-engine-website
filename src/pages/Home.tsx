import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { CopyButton } from "@/components/CopyButton/CopyButton";
import { FeatureCard } from "@/components/FeatureCard/FeatureCard";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { FEATURES } from "@/data/features";
import { SITE } from "@/data/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const HERO_CODE = `result = BharatFilterEngine.apply(
  scope: Sale.all,
  config: FILTER_CONFIG,
  params: { stage: "qualified", status: ["approved", "pending"] }
)`;

const PAGE_CODE = `FILTER_CONFIG = {
  stage: {
    type: :single,
    filter_type: :string,
    dbcolumn: :stage
  },

  status: {
    type: :single,
    filter_type: :array,
    dbcolumn: :approval_status
  },

  amount: {
    type: :single,
    filter_type: :integer,
    dbcolumn: :amount,
    range_type: :gte
  }
}

result = BharatFilterEngine.apply(
  scope: Sale.all,
  config: FILTER_CONFIG,
  params: {
    stage: "qualified",
    status: ["approved", "pending"],
    amount: "500"
  }
)`;

const PROBLEMS = [
  "Repetitive ActiveRecord where conditions",
  "Complex controller filtering logic",
  "Hardcoded database columns",
  "Hard-to-maintain filtering implementations",
  "Repeated association queries",
];

const STEPS = [
  "Define filter configuration",
  "Receive user filtering parameters",
  "Pass scope, config and params to BharatFilterEngine.apply",
  "Get the filtered ActiveRecord relation",
];

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{title}</h2>
      {subtitle && <p className="mt-2">{subtitle}</p>}
    </div>
  );
}

export function Home() {
  useDocumentTitle("Filtering for Rails ActiveRecord", "Configurable, reusable filtering for Ruby on Rails ActiveRecord applications.");
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-violet-950/30" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{SITE.name}</h1>
            <p className="mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-semibold text-transparent">{SITE.tagline}</p>
            <p className="mt-4 max-w-xl">Build reusable, configurable, and maintainable ActiveRecord filtering logic without writing repetitive query conditions.</p>
            <div className="mt-6 flex max-w-md items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-mono text-sm text-slate-100">
              <code>$ {SITE.installCommand}</code>
              <CopyButton text={SITE.installCommand} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/docs/installation">Get Started</Button>
              <Button variant="secondary" href={SITE.repoUrl}><Github className="h-4 w-4" /> View on GitHub</Button>
              <Button variant="ghost" to="/playground">Try the simulator</Button>
            </div>
          </div>
          <CodeBlock code={HERO_CODE} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <SectionTitle title="Filtering by hand gets messy" />
          <ul className="list-disc space-y-1 pl-5">{PROBLEMS.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div>
          <SectionTitle title="Describe the rules once" subtitle="Move the conditions into a configuration; the engine builds the relation." />
          <CodeBlock code={`@sales = BharatFilterEngine.apply(scope: Sale.all, config: FILTER_CONFIG, params: params)`} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionTitle title="18 supported capabilities" subtitle="Badges show the changelog version where each appeared." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => <FeatureCard key={feature.slug} feature={feature} />)}
          </div>
          <Link to="/features" className="mt-6 inline-block font-medium text-indigo-600 hover:underline dark:text-indigo-400">See examples and limitations &rarr;</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle title="How it works" />
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Step {index + 1}</span>
              <p className="mt-1 text-sm">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <SectionTitle title="Install" />
        <CodeBlock language="ruby" code={`gem "bharat_filter_engine"`} />
        <CodeBlock language="bash" code="bundle install" />
        <CodeBlock language="bash" code={SITE.installCommand} />
        <Callout kind="warning" title="Prerelease notice">
          <p>This site documents source version 0.2.0pre, which the changelog marks Unreleased. A plain <code>gem install</code> skips prereleases, so newer features may not be in the version you get. See the installation page.</p>
        </Callout>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <SectionTitle title="A practical example" />
        <CodeBlock code={PAGE_CODE} showLineNumbers />
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to simplify your ActiveRecord filtering?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
          <Link to="/docs/installation" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700">Get Started</Link>
          <Link to="/docs" className="rounded-lg border border-white/50 px-4 py-2 text-sm font-medium">Explore Documentation</Link>
          <a href={SITE.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/50 px-4 py-2 text-sm font-medium">View GitHub Repository</a>
        </div>
      </section>
    </>
  );
}
