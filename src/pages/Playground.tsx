import { ConfigBuilder } from "@/components/Playground/ConfigBuilder";
import { FilterPlayground } from "@/components/Playground/FilterPlayground";
import { SimulatorBanner } from "@/components/Playground/SimulatorBanner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Playground() {
  useDocumentTitle("Playground", "Frontend simulator and configuration builder for Bharat Filter Engine.");
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Playground</h1>
      <SimulatorBanner />
      <FilterPlayground />
      <h2 className="mt-14 text-2xl font-bold text-slate-900 dark:text-white">Configuration builder</h2>
      <p className="mb-4 mt-1">Pick options and copy a Ruby FILTER_CONFIG. Validation rules come from the gem's RuleNormalizer.</p>
      <ConfigBuilder />
    </section>
  );
}
