import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/quiz" className="hover:text-foreground transition-colors">Quiz</Link>
          <Link href="/countries" className="hover:text-foreground transition-colors">Countries</Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link>
          <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
        </div>
        <p className="mb-2">&copy; {new Date().getFullYear()} Expatlix. A relocation intelligence tool.</p>
        <p className="text-xs">Data provided for informational purposes only. Not financial or legal advice.</p>
      </div>
    </footer>
  );
}
