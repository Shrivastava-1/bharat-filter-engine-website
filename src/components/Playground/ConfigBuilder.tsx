import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { ruleToRuby, validateRule, type FilterType, type RangeType, type Rule } from "@/utils/simulator";

const FILTER_TYPES: FilterType[] = ["string", "array", "boolean", "integer", "float", "daterange", "presence", "search"];
const RANGE_TYPES: RangeType[] = ["gte", "lte", "between"];

interface BuiltRule { key: string; rule: Rule }

export function ConfigBuilder() {
  const [key, setKey] = useState("stage");
  const [filterType, setFilterType] = useState<FilterType>("string");
  const [column, setColumn] = useState("stage");
  const [rangeType, setRangeType] = useState<RangeType | "">("");
  const [negate, setNegate] = useState(false);
  const [rules, setRules] = useState<BuiltRule[]>([]);

  const isSearch = filterType === "search";
  const columns = column.split(",").map((part) => part.trim()).filter(Boolean);
  const draft: Rule = {
    filterType,
    dbcolumn: isSearch ? undefined : column.trim(),
    dbcolumns: isSearch ? columns : undefined,
    rangeType: rangeType || undefined,
    negate: negate || undefined,
  };
  const error = key.trim() ? validateRule(draft) : "Enter a parameter name.";
  const output = `FILTER_CONFIG = {\n${rules.map((item) => ruleToRuby(item.key, item.rule)).join(",\n")}\n}.freeze`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3 text-sm">
        <label className="block">Parameter name
          <input value={key} onChange={(e) => setKey(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <label className="block">filter_type
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as FilterType)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900">
            {FILTER_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label className="block">{isSearch ? "dbcolumns (comma-separated)" : "dbcolumn"}
          <input value={column} onChange={(e) => setColumn(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <label className="block">range_type
          <select value={rangeType} onChange={(e) => setRangeType(e.target.value as RangeType | "")} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900">
            <option value="">(none)</option>
            {RANGE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={negate} onChange={(e) => setNegate(e.target.checked)} /> negate: true</label>
        {error && <Callout kind="warning" title="The gem would reject this rule"><p>{error}</p></Callout>}
        <Button onClick={() => !error && setRules([...rules.filter((item) => item.key !== key.trim()), { key: key.trim(), rule: draft }])}>Add rule</Button>
      </div>
      <div>
        <CodeBlock code={rules.length ? output : "# Add a rule to generate FILTER_CONFIG"} />
        <p className="text-xs text-slate-500">Validation mirrors RuleNormalizer; generated rules use the modern type: :single format. Nested association rules are not generated here.</p>
      </div>
    </div>
  );
}
