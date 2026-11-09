# Bharat Filter Engine: Phase 1 Source Audit

Source: `bharat_filter_engine.zip` (version constant `0.2.0pre`, ~1,100 lines of Ruby in `lib/`, ~2,800 lines of specs).
Method: full static read of `lib/`, gemspec, README, CHANGELOG, compatibility files and spec descriptions.
**Limitation:** Ruby is not installed in this environment, so RSpec was **not executed**. Behavior below comes from reading code and specs.

## 1. Verified feature inventory (all 18 requested cards are supported)

| # | Feature | Evidence |
|---|---|---|
| 1 | String (exact match) | `Engine#apply_string_filter`, spec "applies string filter" |
| 2 | Array / multi-value (`IN`) | `apply_array_filter`; Array, comma string, JSON string via `normalize_value` |
| 3 | Boolean | `ActiveModel::Type::Boolean`; `false` is not skipped as blank |
| 4 | Integer (exact) | `NUMERIC_PATTERN` check, `to_i`; invalid input ignored |
| 5 | Float (exact) | same path with `to_f` |
| 6 | Numeric range | `range_type: :gte / :lte / :between` (integer/float only) |
| 7 | Date range | `:daterange`; Hash / Array / comma string; open-ended; `beginning_of_day` / `end_of_day` |
| 8 | Presence | `:presence`; string/text treat `''` as blank, other types use `NULL` only |
| 9 | Negation | `negate: true` for string, array, boolean, exact integer/float |
| 10 | Nested association | `type: :nested`, `association:`, `.distinct` |
| 11 | Multi-level association | `a__b__c` via `AssociationResolver#resolve` |
| 12 | Free-text search | `filter_type: :search`, `dbcolumns:`, LIKE with escaping |
| 13 | Field-based search | `field=value` when the term contains `=` |
| 14 | AND / OR | `&` between groups, `\|` within a group |
| 15 | Dynamic filter values | `BharatFilterEngine.filter_values`, `DynamicFilterValues` (`filter_term`, `filter_limit`) |
| 16 | Legacy configuration | `RuleNormalizer.normalize` (`type: :string` becomes `single` + `filter_type`) |
| 17 | Parameter normalization | `deep_symbolize_keys`, JSON/comma splitting, blank skipping |
| 18 | Relation chaining | `apply` returns an `ActiveRecord::Relation` (search no-match returns `scope.none`) |

## 2. API stability classification

- **Public (README-documented):** `BharatFilterEngine.apply`, `.filter_values`, `SearchBuilder.new(scope:, allowed_columns:)`, `DynamicFilterValues.new(scope:, field:, term:, limit:)`, the four error classes.
- **Internal (not in README; website will label them "internal, may change"):** `Engine`, `RuleNormalizer`, `AssociationResolver`, `JoinTracker`, `ColumnHelper`.

## 3. Discrepancies and gotchas

Ordered by impact.

1. **Field-based search is not restricted to `dbcolumns` (README says it is).**
   `SearchBuilder#field_based_search` validates fields with `valid_field?`, which only checks that the field exists on the model or resolves through associations. `@allowed_columns` is only used in the constructor check and in `simple_search`. The only related spec (`unknown=value`) uses a column that does not exist, so an existing-but-unconfigured column is untested. Likely effect: a user-controlled `q` can search any real column. *Static reading only; needs a failing spec to confirm.* The site will document the actual behavior with a warning.
2. **`InvalidFilterError` is never raised.** Defined in `errors.rb`, referenced nowhere else in `lib/` or `spec/`. The site will document it as "defined, currently unused".
3. **Comma splitting applies to every String param,** not only array filters. A `:string` filter given `"Acme, Inc"` becomes `["Acme","Inc"]` and runs as `IN`. A search term with a comma is turned into an Array and then stringified (`.to_s`) inside `SearchBuilder#apply`, giving unexpected search text. No spec covers either case.
4. **Rule validation is lazy in `apply`.** `Engine#call` skips blank params before calling `RuleNormalizer`, so an invalid rule only raises once its param is supplied. `filter_values` validates eagerly.
5. **Invalid dates raise `Date::Error`** (an `ArgumentError`) from `Date.parse`; it is not wrapped in a `BharatFilterEngine::Error`. Invalid *numeric* input, by contrast, is silently ignored.
6. **Install command vs. prerelease.** `gem install bharat_filter_engine` installs the latest *stable* version. `0.2.0pre` is a prerelease, and the features in this documentation (between, presence, negate, `filter_term`/`filter_limit`) are marked Unreleased in the CHANGELOG. A Ruby Toolbox page for the gem exists, and its description does not mention presence/negation, so a published version is probably older. I could not confirm which versions are on RubyGems. The site will keep the requested install commands and add a prerelease note.
7. **Compatibility is declared, not proven.** The gemspec requires Ruby >= 3.0 and Rails libs >= 6.1. The repo ships `gemfiles/ar_*.gemfile` (6.1 to 8.1, edge) and `compatibility.yml`, but contains no CI workflow, and the spec helper uses SQLite only. The site will state declared minimums and will not claim tested compatibility.
8. **`id` search uses `CAST(... AS TEXT)`.** Exercised on SQLite only; behavior on other adapters is unverified.
9. **Plain negation and NULLs.** String and exact-number negation use `where.not`, which follows standard SQL (rows with `NULL` are not returned). Only the array-containing-`nil` case is spec-tested.
10. **Version badge:** the README badge currently says `0.2.0pre`, which matches `VERSION`. No mismatch found.
11. **Changelog metadata:** 0.1.0 and 0.1.1 are both dated 2026-08-19; `changelog_uri` points at `blob/main`, while the work is on `release/0.2.0-pre`.

## 4. Content decisions for the site

- The requested Section F snippet (param key `amount` with `range_type: :gte`) is valid and will be used as given.
- Maintainer info comes from the gemspec: Jayesh Rathore.
- All docs pages will carry an "Unreleased (0.2.0pre)" badge where a feature is not in a stable release.
