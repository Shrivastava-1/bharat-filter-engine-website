import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { COLUMNS, PARAM_HINTS, PLAYGROUND_CONFIG, SAMPLE_SALES } from "@/data/sampleData";
import { applyConfig, ruleToRuby, type Rule } from "@/utils/simulator";

const NEGATABLE = ["stage", "status"];

export function FilterPlayground() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [negated, setNegated] = useState<Record<string, boolean>>({});

  const config = useMemo(() => {
    const copy: Record<string, Rule> = {};
    for (const [key, rule] of Object.entries(PLAYGROUND_CONFIG)) copy[key] = { ...rule, negate: negated[key] || undefined };
    return copy;
  }, [negated]);

  const outcome = useMemo(() => {
    try {
      return { rows: applyConfig(SAMPLE_SALES, config, params), error: null };
    } catch (error) {
      return { rows: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }, [config, params]);

  const activeParams = Object.entries(params).filter(([, value]) => value.trim() !== "");
  const paramsRuby = `params = {\n${activeParams.map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`).join(",\n")}\n}`;
  const configRuby = `FILTER_CONFIG = {\n${Object.entries(config).map(([key, rule]) => ruleToRuby(key, rule)).join(",\n")}\n}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">1. Enter filter values</h2>
        <div className="mt-3 space-y-3">
          {Object.keys(PLAYGROUND_CONFIG).map((key) => (
            <div key={key}>
              <label htmlFor={`param-${key}`} className="block text-sm font-medium">{key}</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  id={`param-${key}`}
                  value={params[key] ?? ""}
                  placeholder={PARAM_HINTS[key]}
                  onChange={(event) => setParams({ ...params, [key]: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
                {NEGATABLE.includes(key) && (
                  <label className="flex items-center gap-1 whitespace-nowrap text-xs">
                    <input type="checkbox" checked={Boolean(negated[key])} onChange={(event) => setNegated({ ...negated, [key]: event.target.checked })} />
                    negate
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => { setParams({}); setNegated({}); }} className="mt-4 text-sm text-indigo-600 hover:underline dark:text-indigo-400">Reset</button>
        <CodeBlock code={paramsRuby} />
        <CodeBlock code={configRuby} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">2. Simulated result ({outcome.rows.length} of {SAMPLE_SALES.length} rows)</h2>
        {outcome.error && <Callout kind="warning" title="Simulated error">{<p>{outcome.error}</p>}</Callout>}
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>{COLUMNS.map((column) => <th key={column} className="whitespace-nowrap px-2 py-2 font-medium">{column}</th>)}</tr>
            </thead>
            <tbody>
              {outcome.rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-slate-200 dark:border-slate-800">
                  {COLUMNS.map((column) => <td key={column} className="whitespace-nowrap px-2 py-1.5">{row[column] === null ? "NULL" : String(row[column])}</td>)}
                </tr>
              ))}
              {outcome.rows.length === 0 && <tr><td colSpan={COLUMNS.length} className="px-2 py-4 text-center">No matching rows</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">Tip: try status "approved,pending" on the stage field to see comma splitting, or sale_date "not-a-date" for the Date::Error case.</p>
      </div>
    </div>
  );
}
