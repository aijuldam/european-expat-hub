import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Show first N items inline on tablet; the rest go into "More"
const TABLET_LIMIT = 4;

export function TopNav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const active = (href: string) => location.startsWith(href);
  const linkCls = (href: string) =>
    `text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${
      active(href) ? "text-accent border-b-2 border-accent pb-0.5" : "text-muted-foreground"
    }`;

  return (
    <header className={`sticky top-0 z-50 bg-background border-b transition-shadow${scrolled ? " shadow-sm" : ""}`}>
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-8 h-8 flex-shrink-0" />
          {/* Mobile: name + tagline stacked */}
          <div className="flex flex-col sm:hidden leading-none">
            <span className="font-serif font-bold text-base text-primary tracking-tight">Expatlix</span>
            <span className="text-[9px] font-semibold text-muted-foreground tracking-[0.12em] uppercase mt-0.5">Relocation Intelligence</span>
          </div>
          {/* Tablet+: name only */}
          <span className="hidden sm:inline font-serif font-bold text-xl text-primary">Expatlix</span>
        </Link>

        {/* Desktop ≥1024px: all items */}
        <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center" aria-label="Guides">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={linkCls(item.href)}
            >{item.label}</Link>
          ))}
        </nav>

        {/* Tablet 640–1023px: first TABLET_LIMIT inline + "More" dropdown */}
        <nav className="hidden sm:flex lg:hidden items-center gap-4 flex-1 justify-center" aria-label="Guides">
          {NAV_ITEMS.slice(0, TABLET_LIMIT).map((item) => (
            <Link key={item.href} href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={linkCls(item.href)}
            >{item.label}</Link>
          ))}
          {NAV_ITEMS.length > TABLET_LIMIT && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                More <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {NAV_ITEMS.slice(TABLET_LIMIT).map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Right slot: hamburger (mobile) */}
        <div className="flex items-center gap-3 shrink-0">
          <Sheet>
            <SheetTrigger className="sm:hidden rounded-md p-2 hover:bg-muted" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-full flex flex-col pt-6">
              {/* Drawer header with logo lockup */}
              <div className="flex items-center gap-3 px-2 pb-6 border-b border-border/50">
                <img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-10 h-10 flex-shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="font-serif font-bold text-xl text-primary tracking-tight">Expatlix</span>
                  <span className="text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase mt-1">Relocation Intelligence</span>
                </div>
              </div>
              <nav className="flex flex-col flex-1 gap-1 mt-4" aria-label="Guides">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    className={`py-3 px-2 text-base font-medium border-b border-border/50 transition-colors hover:text-accent ${active(item.href) ? "text-accent" : "text-foreground"}`}
                  >{item.label}</Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
