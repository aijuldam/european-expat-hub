import { Layout } from "@/components/layout/Layout";
import { Home, Clock } from "lucide-react";

export default function GuideSettleDown() {
  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Settle Down
            </h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Coming soon</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
