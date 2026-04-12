import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/quiz", label: "Quiz" },
    { href: "/countries", label: "Countries" },
    { href: "/compare", label: "Compare" },
    { href: "/salary-calculator", label: "Salary Calculator" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-xl text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-sans text-sm">EH</span>
          </div>
          European Expat Hub
        </Link>
        <nav className="hidden md:flex items-center gap-6">
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
        <div className="flex md:hidden">
          {/* Mobile menu button could go here, omitting for brevity or adding a simple one later */}
        </div>
      </div>
    </header>
  );
}
