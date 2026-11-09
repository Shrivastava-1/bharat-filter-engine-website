import type { CalloutKind } from "@/components/ui/Callout";

export type DocBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; code: string; language?: string }
  | { type: "callout"; kind: CalloutKind; title?: string; text: string };

export interface DocPageData {
  slug: string;
  title: string;
  section: string;
  keywords: string;
  blocks: DocBlock[];
}

const h2 = (text: string): DocBlock => ({ type: "h2", text });
const p = (text: string): DocBlock => ({ type: "p", text });
const code = (c: string, language = "ruby"): DocBlock => ({ type: "code", code: c, language });
const note = (kind: CalloutKind, text: string, title?: string): DocBlock => ({ type: "callout", kind, text, title });

export const DOC_PAGES: DocPageData[] = [
  {
    slug: "introduction", title: "Introduction", section: "Start here",
    keywords: "what is overview why problems technologies",
    blocks: [
      h2("What is Bharat Filter Engine?"),
      p("A configurable filtering engine for Ruby on Rails ActiveRecord applications. You describe filtering rules in a Hash, and the engine turns incoming parameters into an ActiveRecord relation, instead of you writing conditional where clauses in every controller."),
      h2("How it works"),
      p("For each key in your config, the engine looks up the matching parameter. Blank values are skipped, other values are normalized, and the rule's filter is applied to your scope. You get back an ActiveRecord::Relation."),
      code(`BharatFilterEngine.apply(scope: Sale.all, config: FILTER_CONFIG, params: params)`),
      h2("Supported technologies"),
      p("Ruby 3.0 or newer, and ActiveRecord, ActiveModel and ActiveSupport 6.1 or newer (declared in the gemspec)."),
      note("info", "The gem works on ActiveRecord relations. It does not authenticate or authorize: pass a scope you already trust, such as current_user.sales."),
    ],
  },
  {
    slug: "installation", title: "Installation", section: "Start here",
    keywords: "install gem bundle gemfile prerelease version verify requirements",
    blocks: [
      h2("Requirements"),
      p("Ruby >= 3.0 and activerecord, activemodel, activesupport >= 6.1."),
      h2("Gemfile"),
      code(`gem "bharat_filter_engine"`),
      code("bundle install", "bash"),
      h2("Direct install"),
      code("gem install bharat_filter_engine", "bash"),
      note("warning", "The source documented here is version 0.2.0pre, which CHANGELOG.md marks Unreleased. gem install and the Gemfile line above resolve to the latest stable release, not a prerelease. Features marked 0.2.0pre (numeric between, presence, negate, filter_term/filter_limit, direct SearchBuilder use) may be missing from that release.", "Prerelease installation"),
      note("unverified", "I could not confirm which versions are published on RubyGems. To use the development branch, a Bundler git source is the standard approach (not described in the README):"),
      code(`gem "bharat_filter_engine",
    github: "jayesh70240/bharat-filter-engine",
    branch: "release/0.2.0-pre"`),
      h2("Verify"),
      code(`ruby -e 'require "bharat_filter_engine"; puts BharatFilterEngine::VERSION'`, "bash"),
    ],
  },
  {
    slug: "getting-started", title: "Getting Started", section: "Start here",
    keywords: "config scope params chaining legacy normalization blank first example",
    blocks: [
      h2("The three inputs"),
      p("scope is the base relation, config maps parameter names to rules, and params holds the incoming values (a Hash or Rails params)."),
      code(`FILTER_CONFIG = {
  stage:  { type: :single, filter_type: :string, dbcolumn: :stage },
  status: { type: :single, filter_type: :array,  dbcolumn: :approval_status }
}.freeze

sales = BharatFilterEngine.apply(
  scope: Sale.all,
  config: FILTER_CONFIG,
  params: { stage: "qualified", status: ["approved", "pending"] }
)

sales.order(created_at: :desc).limit(20)`),
      h2("Blank values and normalization"),
      p("nil, empty strings and empty arrays are skipped. false is kept, because it is a meaningful boolean filter. Keys may be strings or symbols. Strings that start with [ are parsed as JSON; other strings containing a comma are split into arrays."),
      note("warning", "Comma splitting applies to every string value, including :string and :search filters. A :string filter given \"Acme, Inc\" becomes [\"Acme\", \"Inc\"] and runs as IN. A search term with a comma is converted to an array and then stringified. No spec covers either case.", "Comma normalization"),
      h2("Legacy configuration"),
      code(`# Legacy (still normalized)
{ type: :string, dbcolumn: :stage }

# Modern equivalent
{ type: :single, filter_type: :string, dbcolumn: :stage }`),
      note("warning", "Rules are validated only when their parameter is non-blank. A misconfigured rule raises the first time a request supplies that parameter, not at boot.", "Lazy validation"),
    ],
  },
  {
    slug: "filter-types", title: "Filter Types", section: "Filters",
    keywords: "string array boolean integer float range gte lte between daterange date presence negate negation",
    blocks: [
      h2("String and array"),
      p("string matches exactly. array matches any value (IN) and accepts a Ruby array, a comma string or a JSON array string."),
      code(`status: { type: :single, filter_type: :array, dbcolumn: :approval_status }
# params: { status: ["approved", "pending"] }
#         { status: "approved,pending" }
#         { status: '["approved","pending"]' }`),
      h2("Boolean"),
      p("Values are cast with ActiveModel::Type::Boolean. Both true and false filter."),
      h2("Integer, float and numeric ranges"),
      p("Without range_type the match is exact. Input must match a numeric pattern; invalid input is ignored. range_type accepts :gte, :lte and :between (integer and float only). Between takes a Hash or two-element array, is inclusive, and may be open-ended. A bound that is not numeric is ignored."),
      code(`amount: { type: :single, filter_type: :integer, dbcolumn: :amount, range_type: :between }
# params: { amount: { from: "500", to: "5000" } }
#         { amount: ["500", "5000"] }`),
      note("info", ":between is new in 0.2.0pre; :gte and :lte are in 0.1.0."),
      h2("Date range"),
      code(`sale_date: { type: :single, filter_type: :daterange, dbcolumn: :actual_sale_date }
# params: { sale_date: { from: "2026-07-01", to: "2026-07-31" } }
#         { sale_date: ["2026-07-01", "2026-07-31"] }
#         { sale_date: "2026-07-01,2026-07-31" }`),
      p("Dates are parsed with Date.parse. A from bound becomes beginning_of_day and a to bound becomes end_of_day. Either bound may be omitted."),
      note("warning", "An unparseable date raises Date::Error (an ArgumentError). It is not wrapped in a BharatFilterEngine::Error, so rescuing BharatFilterEngine::Error will not catch it. Invalid numbers, by contrast, are silently ignored.", "Invalid dates"),
      h2("Presence"),
      p("true selects present values and false selects blank ones. String and text columns count NULL and empty string as blank; other column types check NULL only, so integer 0 is present. New in 0.2.0pre."),
      h2("Negation"),
      code(`stage: { type: :single, filter_type: :string, dbcolumn: :stage, negate: true }`),
      p("Supported for string, array, boolean and exact integer/float filters. Combining negate: true with range_type, :daterange, :search or :presence raises InvalidConfigurationError. New in 0.2.0pre."),
      note("unverified", "Plain negation uses where.not, which under standard SQL does not return rows whose column is NULL. Only the array-containing-nil case is covered by a spec; confirm the NULL behavior on your database."),
    ],
  },
  {
    slug: "associations", title: "Association Filtering", section: "Filters",
    keywords: "nested association multi-level double underscore join distinct invalid same table",
    blocks: [
      h2("Nested"),
      code(`lead_source: {
  type: :nested,
  filter_type: :array,
  association: :lead,
  dbcolumn: :source
}`),
      p("The association is resolved from ActiveRecord reflections and joined, and nested results use distinct. An association that cannot be resolved raises InvalidAssociationError."),
      h2("Multi-level"),
      p("Use double underscores to walk several associations."),
      code(`organization_name: {
  type: :nested,
  filter_type: :string,
  association: :lead__client__organization,
  dbcolumn: :name
}`),
      p("When two paths reach the same table (for example client and referrer), the engine tracks joins and uses a subquery so each condition stays on its own path. Fixed in 0.2.0pre."),
    ],
  },
  {
    slug: "search", title: "Search", section: "Filters",
    keywords: "search free text field based and or allowed columns dbcolumns id like wildcard escape",
    blocks: [
      h2("Configuring search"),
      code(`q: {
  type: :single,
  filter_type: :search,
  dbcolumns: [:stage, :approval_status, :lead__source, :lead__client__name]
}`),
      p("A search rule uses dbcolumns (not dbcolumn), must be type: :single, and cannot be negated. Matching is a case-insensitive substring match, and %, _ and backslash in input are escaped as literals."),
      h2("Field-based syntax"),
      p("If the term contains =, it is read as field=value. & means AND between groups; | means OR within a group."),
      code(`stage=qualified
stage=qualified&lead__source=google
stage=qualified|stage=new
stage=qualified&approval_status=approved|approval_status=pending`, "text"),
      p("A group whose fields are all invalid matches nothing (it is not dropped). id=42 casts the id to text and substring-matches it."),
      note("unverified", "The README says field-based search only accepts fields listed in dbcolumns. In SearchBuilder, field_based_search validates fields only by checking they exist on the model or resolve through associations; the allowed list is used in the constructor and in simple search. The only related spec uses a nonexistent column. If this reading is right, a user-controlled search term can target any real column. Confirm with a spec before relying on dbcolumns as a restriction, and avoid exposing sensitive columns through this path.", "Field-based search restriction"),
      note("unverified", "The id search uses CAST(... AS TEXT). The specs run on SQLite only; other adapters are unverified."),
    ],
  },
  {
    slug: "dynamic-values", title: "Dynamic Filter Values", section: "Filters",
    keywords: "dynamic values dropdown filter_values filter_term filter_limit distinct",
    blocks: [
      code(`BharatFilterEngine.filter_values(
  scope: Sale.all,
  config: FILTER_CONFIG,
  params: { filter_field: "stage", filter_term: "qual", filter_limit: 10 }
)`),
      p("Returns distinct, sorted, non-blank values for the configured field (nested fields included). filter_term and filter_limit are new in 0.2.0pre; a limit of zero is ignored. An unknown field, or a rule without dbcolumn, returns []. Only the scope is applied; other filters are not."),
      h2("Direct API"),
      code(`BharatFilterEngine::DynamicFilterValues.new(
  scope: Sale.all,
  field: "lead__client__name",
  term: "Acme",
  limit: 10
).call`),
      p("The class returns nil when the field cannot be resolved; filter_values converts that to []."),
    ],
  },
  {
    slug: "errors", title: "Errors and Validation", section: "Reference",
    keywords: "errors exceptions invalid configuration association rescue Error InvalidFilterError",
    blocks: [
      code(`BharatFilterEngine::Error
  InvalidConfigurationError
  InvalidFilterError
  InvalidAssociationError`, "text"),
      p("InvalidConfigurationError covers an unknown filter_type or range_type, a missing dbcolumn, association or dbcolumns, range_type on a non-numeric filter, unsupported negate, and :search with type: :nested. InvalidAssociationError is raised for unresolvable nested associations."),
      note("warning", "InvalidFilterError is defined but never raised anywhere in lib/. Rescuing it has no effect today.", "Unused error class"),
      code(`begin
  BharatFilterEngine.apply(scope: Sale.all, config: FILTER_CONFIG, params: params)
rescue BharatFilterEngine::Error => e
  Rails.logger.error("Filter error: #{e.message}")
  raise
end`),
    ],
  },
  {
    slug: "rails", title: "Rails Integration", section: "Reference",
    keywords: "rails controller strong parameters pagination sales index forms dropdown",
    blocks: [
      code(`class SalesController < ApplicationController
  FILTER_CONFIG = {
    stage:  { type: :single, filter_type: :string, dbcolumn: :stage },
    status: { type: :single, filter_type: :array,  dbcolumn: :approval_status }
  }.freeze

  def index
    @sales = BharatFilterEngine.apply(
      scope: current_user.sales.order(created_at: :desc),
      config: FILTER_CONFIG,
      params: filter_params
    )
  end

  def filter_values
    render json: BharatFilterEngine.filter_values(
      scope: current_user.sales, config: FILTER_CONFIG, params: params
    )
  end

  private

  def filter_params
    params.permit(:stage, status: [])
  end
end`),
      p("Permit parameters in the same shape your forms submit: arrays as arrays, and range or date Hashes with their from and to keys."),
    ],
  },
  {
    slug: "troubleshooting", title: "Troubleshooting", section: "Reference",
    keywords: "troubleshooting problems cause solution comma date unknown field",
    blocks: [
      h2("My string filter returns the wrong rows"),
      p("The value probably contains a comma and was split into an array. Use an array filter deliberately, or avoid commas in string values."),
      h2("Date::Error is raised"),
      p("A date string could not be parsed. Validate dates before calling the engine."),
      h2("A bad rule does not fail at startup"),
      p("Rules are validated lazily, only when their parameter is present. Exercise every rule in a test."),
      h2("InvalidAssociationError"),
      p("The association name in association: is not defined on the model (or on a model along the __ path)."),
      h2("Search returns nothing"),
      p("A field-based group with no valid field matches no records. Check field names, including __ paths."),
    ],
  },
  {
    slug: "project", title: "Contributing and License", section: "Reference",
    keywords: "contributing license support maintainer fork rspec pull request issues",
    blocks: [
      p("Fork the repository, create a branch, make changes, add or update RSpec tests, run bundle exec rspec, and open a pull request. Include a reproducible example in bug reports."),
      code(`git clone https://github.com/jayesh70240/bharat-filter-engine.git
cd bharat-filter-engine
bundle install
bundle exec rspec`, "bash"),
      p("License: MIT. Author (from the gemspec): Jayesh Rathore. Issues: github.com/jayesh70240/bharat-filter-engine/issues."),
    ],
  },
];

export function findDocPage(slug: string | undefined): DocPageData | undefined {
  return DOC_PAGES.find((page) => page.slug === slug);
}

/** Case-insensitive search over titles, keywords and headings. */
export function searchDocs(query: string): DocPageData[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return DOC_PAGES.filter((page) => {
    const headings = page.blocks.filter((b) => b.type === "h2").map((b) => (b.type === "h2" ? b.text : ""));
    return [page.title, page.keywords, ...headings].join(" ").toLowerCase().includes(needle);
  });
}
