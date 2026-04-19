export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Where to Move",    href: "/quiz" },
  { label: "Calculate Salary", href: "/salary-calculator" },
  { label: "Compare Cities",   href: "/compare" },
  { label: "Settle Down",      href: "/guides/settle-down" },
  { label: "Schools & Family", href: "/guides/schools-family" },
];
