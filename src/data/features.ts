import {
  Ban, CalendarRange, CircleDot, FileSearch, Hash, History, Link2, List, ListFilter,
  Network, Percent, Search, Sparkles, Split, ToggleLeft, Type, ArrowLeftRight, Workflow,
  type LucideIcon,
} from "lucide-react";

/** "unlisted" = present in the source, but not itemised in CHANGELOG.md. */
export type FeatureSince = "0.1.0" | "0.2.0pre" | "unlisted";

export interface Feature {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  since: FeatureSince;
  example: string;
  limitation: string;
  docPath: string;
}

export const FEATURES: Feature[] = [
  { slug: "string", title: "String Filtering", icon: Type, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Exact-equality match on a column.",
    example: `stage: { type: :single, filter_type: :string, dbcolumn: :stage }`,
    limitation: "Exact match only. A value containing a comma is split into an array and run as IN." },
  { slug: "array", title: "Array / Multi-value Filtering", icon: List, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Match any of several values (SQL IN). Accepts arrays, comma strings and JSON array strings.",
    example: `status: { type: :single, filter_type: :array, dbcolumn: :approval_status }`,
    limitation: "Comma-separated and JSON-array strings are converted before filtering." },
  { slug: "boolean", title: "Boolean Filtering", icon: ToggleLeft, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Casts request values with ActiveModel::Type::Boolean. false is a valid filter value.",
    example: `active: { type: :single, filter_type: :boolean, dbcolumn: :active }`,
    limitation: "Any value ActiveModel does not treat as false is cast to true." },
  { slug: "integer", title: "Integer Filtering", icon: Hash, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Exact integer match. Non-numeric input is ignored rather than turned into a condition.",
    example: `amount: { type: :single, filter_type: :integer, dbcolumn: :amount }`,
    limitation: "Input must match the engine's numeric pattern (optional sign, digits, optional decimals)." },
  { slug: "float", title: "Float Filtering", icon: Percent, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Exact decimal match using the same numeric validation as integers.",
    example: `rate: { type: :single, filter_type: :float, dbcolumn: :conversion_rate }`,
    limitation: "Exact float equality follows database float semantics." },
  { slug: "numeric-range", title: "Numeric Range Filtering", icon: ArrowLeftRight, since: "0.2.0pre", docPath: "/docs/filter-types",
    summary: "range_type :gte, :lte (0.1.0) and :between (0.2.0pre) for integer and float filters. Bounds are inclusive.",
    example: `amount: { type: :single, filter_type: :integer, dbcolumn: :amount, range_type: :between }`,
    limitation: ":between is new in 0.2.0pre. range_type is only valid for integer and float filters." },
  { slug: "date-range", title: "Date Range Filtering", icon: CalendarRange, since: "0.1.0", docPath: "/docs/filter-types",
    summary: "Hash, array or comma-string input; either bound may be omitted. From is beginning_of_day, to is end_of_day.",
    example: `sale_date: { type: :single, filter_type: :daterange, dbcolumn: :actual_sale_date }`,
    limitation: "An unparseable date raises Date::Error (not a BharatFilterEngine error). Cannot be negated." },
  { slug: "presence", title: "Presence Filtering", icon: CircleDot, since: "0.2.0pre", docPath: "/docs/filter-types",
    summary: "true finds present values, false finds blank ones. String/text columns treat NULL and '' as blank; other types use NULL only.",
    example: `has_closed_at: { type: :single, filter_type: :presence, dbcolumn: :closed_at }`,
    limitation: "New in 0.2.0pre. Cannot be negated." },
  { slug: "negation", title: "Negation / Exclusion Filtering", icon: Ban, since: "0.2.0pre", docPath: "/docs/filter-types",
    summary: "negate: true excludes matches for string, array, boolean and exact integer/float filters.",
    example: `stage: { type: :single, filter_type: :string, dbcolumn: :stage, negate: true }`,
    limitation: "Raises InvalidConfigurationError with range_type, :daterange, :search or :presence." },
  { slug: "nested", title: "Nested Association Filtering", icon: Link2, since: "0.1.0", docPath: "/docs/associations",
    summary: "Filter a column on an associated model. The association is joined and results are made distinct.",
    example: `lead_source: { type: :nested, filter_type: :array, association: :lead, dbcolumn: :source }`,
    limitation: "The association must exist on the model; otherwise InvalidAssociationError is raised." },
  { slug: "multi-level", title: "Multi-level Association Filtering", icon: Network, since: "0.1.0", docPath: "/docs/associations",
    summary: "Traverse several associations with double-underscore notation.",
    example: `org: { type: :nested, filter_type: :string, association: :lead__client__organization, dbcolumn: :name }`,
    limitation: "Every segment must be a real association. Same-table path handling was fixed in 0.2.0pre." },
  { slug: "free-text-search", title: "Free-text Search", icon: Search, since: "unlisted", docPath: "/docs/search",
    summary: "Case-insensitive substring search across configured columns, including associated ones.",
    example: `q: { type: :single, filter_type: :search, dbcolumns: [:stage, :lead__source] }`,
    limitation: "Uses type: :single with dbcolumns. LIKE wildcards in input are escaped. Cannot be negated." },
  { slug: "field-search", title: "Field-based Search", icon: FileSearch, since: "0.1.0", docPath: "/docs/search",
    summary: "When the term contains =, it is read as field=value pairs.",
    example: `params: { q: "stage=qualified" }`,
    limitation: "Read the field-restriction warning on the Search page: the source does not appear to enforce dbcolumns here." },
  { slug: "and-or", title: "AND / OR Search Conditions", icon: Split, since: "0.1.0", docPath: "/docs/search",
    summary: "& joins groups with AND; | joins expressions inside a group with OR.",
    example: `params: { q: "stage=qualified&approval_status=approved|approval_status=pending" }`,
    limitation: "A group with no valid field matches nothing (fixed in 0.1.1)." },
  { slug: "dynamic-values", title: "Dynamic Filter Values", icon: ListFilter, since: "0.1.0", docPath: "/docs/dynamic-values",
    summary: "Distinct, sorted, non-blank values for dropdowns. filter_term and filter_limit were added in 0.2.0pre.",
    example: `BharatFilterEngine.filter_values(scope: Sale.all, config: FILTER_CONFIG, params: { filter_field: "stage" })`,
    limitation: "Unknown field returns []. Only the scope is used; other filters are not applied." },
  { slug: "legacy", title: "Legacy Configuration Support", icon: History, since: "0.1.0", docPath: "/docs/getting-started",
    summary: "The older style where type is the filter type is still normalized.",
    example: `stage: { type: :string, dbcolumn: :stage }`,
    limitation: "Prefer the modern type + filter_type format for new code." },
  { slug: "normalization", title: "Automatic Parameter Normalization", icon: Sparkles, since: "unlisted", docPath: "/docs/getting-started",
    summary: "String or symbol keys; blank values skipped; JSON-array and comma strings converted.",
    example: `{ "stage" => "qualified" }  # same as { stage: "qualified" }`,
    limitation: "Comma splitting applies to every string value, not only array filters." },
  { slug: "chaining", title: "ActiveRecord Relation Chaining", icon: Workflow, since: "unlisted", docPath: "/docs/getting-started",
    summary: "apply returns an ActiveRecord::Relation, so order, limit and pagination keep working.",
    example: `BharatFilterEngine.apply(scope: Sale.all, config: C, params: p).order(created_at: :desc)`,
    limitation: "Nested filters add distinct, which can interact with ordering on some databases." },
];
