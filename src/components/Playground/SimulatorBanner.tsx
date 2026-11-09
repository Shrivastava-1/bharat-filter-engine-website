import { Callout } from "@/components/ui/Callout";

export function SimulatorBanner() {
  return (
    <Callout kind="warning" title="Frontend simulator: the Ruby gem is NOT running">
      <p>Results are computed in your browser by a small TypeScript re-implementation of behavior read from the gem source, over six sample rows. It does not touch a database and may differ from the real gem, especially for SQL details. Treat it as an illustration, not a test.</p>
    </Callout>
  );
}
