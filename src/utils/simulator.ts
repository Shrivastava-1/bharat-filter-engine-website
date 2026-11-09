/**
 * Browser-side SIMULATOR of the filtering workflow. It does NOT run the Ruby gem.
 * It mirrors behavior read from the gem's source (lib/bharat_filter_engine/*.rb),
 * including its surprising parts (comma splitting, any-column field search).
 */
export type Cell = string | number | boolean | null;
export type Row = Record<string, Cell>;
export type FilterType = "string" | "array" | "boolean" | "integer" | "float" | "daterange" | "presence" | "search";
export type RangeType = "gte" | "lte" | "between";

export interface Rule {
  filterType: FilterType;
  dbcolumn?: string;
  dbcolumns?: string[];
  rangeType?: RangeType;
  negate?: boolean;
}

const NUMERIC_PATTERN = /^[+-]?\d+(\.\d+)?$/;
const FALSE_VALUES = ["false", "0", "f", "off"];

/** Mirrors Engine#normalize_value: JSON array strings, then comma splitting. */
export function normalizeValue(raw: string): string | string[] {
  const stripped = raw.trim();
  if (stripped.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(stripped);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return raw;
    }
    return raw;
  }
  if (raw.includes(",")) return raw.split(",").map((part) => part.trim());
  return raw;
}

/** Mirrors RuleNormalizer validation. Returns an error message or null. */
export function validateRule(rule: Rule): string | null {
  const isNumeric = rule.filterType === "integer" || rule.filterType === "float";
  if (rule.filterType === "search" && !rule.dbcolumns?.length) return "InvalidConfigurationError: a :search rule requires a non-empty dbcolumns array.";
  if (rule.filterType !== "search" && !rule.dbcolumn?.trim()) return "InvalidConfigurationError: filter rule requires a dbcolumn.";
  if (rule.rangeType && !isNumeric) return "InvalidConfigurationError: range_type is only supported for :integer and :float filters.";
  const negateUnsupported = ["daterange", "search", "presence"].includes(rule.filterType);
  if (rule.negate && (rule.rangeType || negateUnsupported)) return "InvalidConfigurationError: negate: true is not supported with range_type, :daterange, :search or :presence.";
  return null;
}

const asList = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]);
const isBlank = (value: string): boolean => value.trim() === "";

function parseDate(text: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(text))) {
    throw new Error("Date::Error: invalid date (the real gem raises this from Date.parse)");
  }
  return text;
}

function filterNumeric(rows: Row[], rule: Rule, value: string | string[]): Row[] {
  const column = rule.dbcolumn ?? "";
  const bounds = asList(value).filter((item) => !isBlank(item));
  const valid = (item: string | undefined): number | null => (item !== undefined && NUMERIC_PATTERN.test(item.trim()) ? Number(item) : null);
  const number = (row: Row): number | null => (typeof row[column] === "number" ? (row[column] as number) : null);

  if (rule.rangeType === "between") {
    const from = valid(bounds[0]);
    const to = valid(bounds[1]);
    if (from === null && to === null) return rows;
    return rows.filter((row) => number(row) !== null && (from === null || number(row)! >= from) && (to === null || number(row)! <= to));
  }
  const target = valid(bounds[0]);
  if (bounds.length !== 1 || target === null) return rows;
  if (rule.rangeType === "gte") return rows.filter((row) => number(row) !== null && number(row)! >= target);
  if (rule.rangeType === "lte") return rows.filter((row) => number(row) !== null && number(row)! <= target);
  return rows.filter((row) => number(row) !== null && (number(row) === target) !== Boolean(rule.negate));
}

function filterSearch(rows: Row[], rule: Rule, value: string | string[]): Row[] {
  // The gem stringifies non-string values with to_s, so an Array becomes '["a", "b"]'.
  const term = (Array.isArray(value) ? `[${value.map((v) => JSON.stringify(v)).join(", ")}]` : value).trim();
  const contains = (cell: Cell, needle: string) => cell !== null && String(cell).toLowerCase().includes(needle.toLowerCase());

  if (!term.includes("=")) {
    return rows.filter((row) => (rule.dbcolumns ?? []).some((column) => contains(row[column] ?? null, term)));
  }
  const groups = term.split("&").map((group) =>
    group.split("|").flatMap((expression) => {
      const [field, ...rest] = expression.split("=");
      const needle = rest.join("=").trim();
      // Mirrors SearchBuilder#valid_field?: any real column, NOT limited to dbcolumns.
      return field && needle && field in (rows[0] ?? {}) ? [{ field, needle }] : [];
    }),
  );
  if (groups.some((group) => group.length === 0)) return [];
  return rows.filter((row) => groups.every((group) => group.some(({ field, needle }) => contains(row[field] ?? null, needle))));
}

export function applyRule(rows: Row[], rule: Rule, rawValue: string): Row[] {
  if (isBlank(rawValue)) return rows;
  const value = normalizeValue(rawValue);
  const column = rule.dbcolumn ?? "";

  switch (rule.filterType) {
    case "string":
    case "array": {
      const wanted = asList(value);
      return rows.filter((row) => {
        const cell = row[column];
        return cell !== null && wanted.includes(String(cell)) !== Boolean(rule.negate);
      });
    }
    case "boolean": {
      const cast = !FALSE_VALUES.includes(String(rawValue).toLowerCase());
      return rows.filter((row) => row[column] !== null && (row[column] === cast) !== Boolean(rule.negate));
    }
    case "integer":
    case "float":
      return filterNumeric(rows, rule, value);
    case "daterange": {
      const [from, to] = asList(value).map((item) => (isBlank(item) ? null : parseDate(item.trim())));
      return rows.filter((row) => {
        const cell = row[column];
        return typeof cell === "string" && (!from || cell >= from) && (!to || cell <= to);
      });
    }
    case "presence": {
      const wantPresent = !FALSE_VALUES.includes(rawValue.toLowerCase());
      return rows.filter((row) => {
        const cell = row[column];
        const present = cell !== null && cell !== "";
        return present === wantPresent;
      });
    }
    case "search":
      return filterSearch(rows, rule, value);
  }
}

export function applyConfig(rows: Row[], config: Record<string, Rule>, params: Record<string, string>): Row[] {
  return Object.entries(config).reduce((current, [key, rule]) => applyRule(current, rule, params[key] ?? ""), rows);
}

export function ruleToRuby(key: string, rule: Rule): string {
  const lines = [`  ${key}: {`, `    type: :single,`, `    filter_type: :${rule.filterType},`];
  if (rule.filterType === "search") lines.push(`    dbcolumns: [${(rule.dbcolumns ?? []).map((c) => `:${c}`).join(", ")}]`);
  else lines.push(`    dbcolumn: :${rule.dbcolumn}${rule.rangeType || rule.negate ? "," : ""}`);
  if (rule.rangeType) lines.push(`    range_type: :${rule.rangeType}${rule.negate ? "," : ""}`);
  if (rule.negate) lines.push(`    negate: true`);
  lines.push(`  }`);
  return lines.join("\n");
}
