export interface DocVersion {
  label: string;
  status: "prerelease" | "released";
  note: string;
}

/** Versions come from CHANGELOG.md. 0.2.0pre is marked "Unreleased" there. */
export const VERSIONS: DocVersion[] = [
  { label: "0.2.0pre", status: "prerelease", note: "Development branch (release/0.2.0-pre)" },
  { label: "0.1.1", status: "released", note: "Changelog date 2026-08-19" },
  { label: "0.1.0", status: "released", note: "Changelog date 2026-08-19" },
];

export const CURRENT_VERSION = VERSIONS[0];
