import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/utils/cn";

const EXAMPLES = [
  { label: "Basic", code: `BharatFilterEngine.apply(
  scope: Sale.all,
  config: {
    stage: { type: :single, filter_type: :string, dbcolumn: :stage }
  },
  params: { stage: "qualified" }
)` },
  { label: "Advanced", code: `config = {
  amount:   { type: :single, filter_type: :integer, dbcolumn: :amount, range_type: :between },
  stage:    { type: :single, filter_type: :string, dbcolumn: :stage, negate: true },
  org:      { type: :nested, filter_type: :string, association: :lead__client__organization, dbcolumn: :name },
  closed:   { type: :single, filter_type: :presence, dbcolumn: :closed_at }
}

BharatFilterEngine.apply(
  scope: Sale.all,
  config: config,
  params: { amount: { from: "500", to: "5000" }, stage: "new", org: "Acme", closed: true }
)` },
  { label: "Rails controller", code: `def index
  @sales = BharatFilterEngine.apply(
    scope: current_user.sales.order(created_at: :desc),
    config: FILTER_CONFIG,
    params: params.permit(:stage, status: [], amount: [:from, :to])
  )
end` },
  { label: "Search", code: `config = {
  q: { type: :single, filter_type: :search, dbcolumns: [:stage, :lead__source] }
}

BharatFilterEngine.apply(scope: Sale.all, config: config, params: { q: "goog" })
BharatFilterEngine.apply(scope: Sale.all, config: config, params: { q: "stage=won&lead__source=google" })` },
];

export function Examples() {
  useDocumentTitle("Examples", "Basic, advanced, Rails controller and search examples.");
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Examples</h1>
      <p className="mt-2">Examples follow the configuration format validated in the gem source; they have not been executed here.</p>
      <div role="tablist" className="mt-6 flex flex-wrap gap-2">
        {EXAMPLES.map((example, index) => (
          <button key={example.label} role="tab" aria-selected={active === index} onClick={() => setActive(index)}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", active === index ? "bg-indigo-600 text-white" : "border border-slate-300 dark:border-slate-700")}>
            {example.label}
          </button>
        ))}
      </div>
      <CodeBlock code={EXAMPLES[active].code} />
    </section>
  );
}
