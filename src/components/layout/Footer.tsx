import { Link } from "wouter";
import { FooterLeadForm } from "@/components/FooterLeadForm";

export function Footer() {
  return (
    <footer className="mt-auto">
      <FooterLeadForm />
      <div className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        {/* Logo mark */}
        <Link href="/" className="inline-flex flex-col items-center gap-2 mb-6 group">
          <img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif font-bold text-base text-foreground">Expatlix</span>
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase mt-0.5">Relocation Intelligence</span>
          </div>
        </Link>
        <div className="flex justify-center gap-6 mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/quiz" className="hover:text-foreground transition-colors">Quiz</Link>
          <Link href="/countries" className="hover:text-foreground transition-colors">Countries</Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link>
          <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
        </div>
        <p className="mb-2">&copy; {new Date().getFullYear()} Expatlix. All rights reserved.</p>
        <p className="text-xs">Data provided for informational purposes only. Not financial or legal advice.</p>
      </div>
      </div>
    </footer>
  );
}
