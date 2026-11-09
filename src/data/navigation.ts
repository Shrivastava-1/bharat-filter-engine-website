export interface NavItem {
  label: string;
  to: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "Documentation", to: "/docs" },
  { label: "Examples", to: "/examples" },
  { label: "Playground", to: "/playground" },
  { label: "Changelog", to: "/changelog" },
];
