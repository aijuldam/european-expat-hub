import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { NAV_ITEMS } from "@/nav";
import { HeaderCitySelector } from "./HeaderCitySelector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const TABLET_LIMIT = 4;

export function TopNav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const active = (slug: string) => location.startsWith(`/guides/${slug}`);
  const linkCls = (slug: string) =>
    `text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${
      active(slug) ? "text-accent border-b-2 border-accent pb-0.5" : "text-muted-foreground"
    }`;

  return (
    <header className={`sticky top-0 z-50 bg-background border-b transition-shadow${scrolled ? " shadow-sm" : ""}`}>
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-serif font-bold text-xl text-primary flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-sans text-sm">EH</span>
          </div>
          <span className="hidden sm:inline">European Expat Hub</span>
        </Link>

        {/* Desktop ≥1024px: all 7 verticals */}
        <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center" aria-label="Guides">
          {NAV_ITEMS.map((item) => (
            <Link key={item.slug} href={`/guides/${item.slug}`}
              aria-current={active(item.slug) ? "page" : undefined}
              className={linkCls(item.slug)}
            >{item.label}</Link>
          ))}
        </nav>

        {/* Tablet 640–1023px: first 4 + "More" dropdown */}
        <nav className="hidden sm:flex lg:hidden items-center gap-4 flex-1 justify-center" aria-label="Guides">
          {NAV_ITEMS.slice(0, TABLET_LIMIT).map((item) => (
            <Link key={item.slug} href={`/guides/${item.slug}`}
              aria-current={active(item.slug) ? "page" : undefined}
              className={linkCls(item.slug)}
            >{item.label}</Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              More <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {NAV_ITEMS.slice(TABLET_LIMIT).map((item) => (
                <DropdownMenuItem key={item.slug} asChild>
                  <Link href={`/guides/${item.slug}`}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right slot: city selector (sm+) + hamburger (mobile) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <HeaderCitySelector />
          </div>
          <Sheet>
            <SheetTrigger className="sm:hidden rounded-md p-2 hover:bg-muted" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-full flex flex-col pt-12">
              <nav className="flex flex-col flex-1 gap-1" aria-label="Guides">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.slug} href={`/guides/${item.slug}`}
                    aria-current={active(item.slug) ? "page" : undefined}
                    className={`py-3 px-2 text-base font-medium border-b border-border/50 transition-colors hover:text-accent ${active(item.slug) ? "text-accent" : "text-foreground"}`}
                  >{item.label}</Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3 pb-4">
                <HeaderCitySelector />
                <Link href="/quiz" className="flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors">
                  Get your checklist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
