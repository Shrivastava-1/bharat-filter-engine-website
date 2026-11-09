import type { Row, Rule } from "@/utils/simulator";

/** Sales rows with lead and client columns flattened using the gem's "__" notation. */
export const SAMPLE_SALES: Row[] = [
  { id: 1, stage: "qualified", approval_status: "approved", active: true, amount: 500, actual_sale_date: "2026-07-05", closed_at: "2026-07-06", lead__source: "google", lead__client__name: "Acme Corp" },
  { id: 2, stage: "qualified", approval_status: "pending", active: true, amount: 1200, actual_sale_date: "2026-07-20", closed_at: null, lead__source: "referral", lead__client__name: "Globex" },
  { id: 3, stage: "new", approval_status: "pending", active: false, amount: 90, actual_sale_date: "2026-06-15", closed_at: null, lead__source: "google", lead__client__name: "Initech" },
  { id: 4, stage: "won", approval_status: "approved", active: true, amount: 5000, actual_sale_date: "2026-07-31", closed_at: "2026-08-01", lead__source: "event", lead__client__name: "Acme Corp" },
  { id: 5, stage: "won", approval_status: "rejected", active: false, amount: 750, actual_sale_date: "2026-08-10", closed_at: "", lead__source: "referral", lead__client__name: "Umbrella" },
  { id: 6, stage: "new", approval_status: null, active: true, amount: 300, actual_sale_date: "2026-05-02", closed_at: null, lead__source: "google", lead__client__name: "Hooli" },
];

export const COLUMNS = ["id", "stage", "approval_status", "active", "amount", "actual_sale_date", "closed_at", "lead__source", "lead__client__name"];

/** Parameter name -> rule, in the same shape the Ruby config uses. */
export const PLAYGROUND_CONFIG: Record<string, Rule> = {
  stage: { filterType: "string", dbcolumn: "stage" },
  status: { filterType: "array", dbcolumn: "approval_status" },
  active: { filterType: "boolean", dbcolumn: "active" },
  amount: { filterType: "integer", dbcolumn: "amount", rangeType: "between" },
  sale_date: { filterType: "daterange", dbcolumn: "actual_sale_date" },
  has_closed_at: { filterType: "presence", dbcolumn: "closed_at" },
  q: { filterType: "search", dbcolumns: ["stage", "approval_status", "lead__source", "lead__client__name"] },
};

export const PARAM_HINTS: Record<string, string> = {
  stage: "qualified",
  status: "approved,pending",
  active: "true / false",
  amount: "500,5000 (from,to)",
  sale_date: "2026-07-01,2026-07-31",
  has_closed_at: "true / false",
  q: "google  or  stage=won&lead__source=referral",
};
