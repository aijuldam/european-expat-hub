import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FirstVisitBanner } from "./FirstVisitBanner";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar />
      <FirstVisitBanner />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
