import { Link, useLocation } from "wouter";
import { HeaderCitySelector } from "./HeaderCitySelector";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/quiz", label: "Quiz" },
    { href: "/countries", label: "Countries" },
    { href: "/compare", label: "Compare" },
    { href: "/salary-calculator", label: "Salary" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif font-bold text-xl text-primary flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-sans text-sm">EH</span>
          </div>
          <span className="hidden sm:inline">European Expat Hub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 flex-1 justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location === link.href || (link.href !== "/" && location.startsWith(link.href))
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* City selector — always visible, right-aligned */}
        <div className="shrink-0">
          <HeaderCitySelector />
        </div>
      </div>
    </header>
  );
}
