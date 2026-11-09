import { FeatureCard } from "@/components/FeatureCard/FeatureCard";
import { FEATURES } from "@/data/features";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Features() {
  useDocumentTitle("Features", "All 18 capabilities of Bharat Filter Engine, with examples and limitations.");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Features</h1>
      <p className="mt-2 max-w-2xl">Every capability below is present in the supplied source. Badges show when it first appears in the changelog.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => <FeatureCard key={feature.slug} feature={feature} expanded />)}
      </div>
    </section>
  );
}
