import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Calendar, Database, Scale } from "lucide-react";

const LAST_UPDATED = "April 2026";

export default function Methodology() {
  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-methodology-title">
              Methodology
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Transparency is core to this tool. Here is how we source, calculate, and present data across the platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p className="leading-relaxed">
                  Expatlix provides indicative estimates and comparative data for informational purposes only.
                  It does not constitute financial, tax, legal, or immigration advice. Always consult qualified
                  professionals for decisions about relocation, taxation, and employment.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</span>
            <Badge variant="secondary" className="text-xs">v1.0 MVP</Badge>
          </div>

          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="data-sources">
              <h2><AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  Data Sources
                </div>
              </AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  City and country data is compiled from multiple publicly available sources including national statistics
                  offices, Eurostat, and international quality-of-life surveys. Specific data points are sourced as follows:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Weather data: National meteorological services and climate databases</li>
                  <li>Safety indices: Composite scoring based on crime statistics and safety surveys</li>
                  <li>Salary data: National statistics offices and salary survey platforms</li>
                  <li>Cost of living: Consumer price indices and cost comparison databases</li>
                </ul>
                <p>
                  Data is structured using comparable indices (0-100 scale) to enable meaningful cross-city
                  comparisons. These indices are relative, not absolute measures.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="salary-calculator">
              <h2><AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  Salary Calculator Methodology
                </div>
              </AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  The salary calculator provides gross-to-net estimates based on 2026 tax parameters for each country.
                </p>
                <h4 className="font-medium text-foreground">Netherlands</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Uses the 2026 Dutch progressive income tax system with two brackets (36.97% and 49.50%)</li>
                  <li>Social security contributions are included in the tax brackets</li>
                  <li>General tax credit (algemene heffingskorting) and labour tax credit (arbeidskorting) are applied</li>
                  <li>The 30% ruling option reduces taxable income by 30% for qualifying expat knowledge workers</li>
                  <li>Calculation structure follows the approach used by Dutch tax calculators such as thetax.nl</li>
                </ul>
                <h4 className="font-medium text-foreground mt-4">France</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Social contributions (cotisations sociales) are deducted first, at approximately 22.5% (non-cadre) or 25% (cadre)</li>
                  <li>CSG and CRDS contributions are calculated on 98.25% of gross salary</li>
                  <li>Income tax is calculated on net social salary using 2026 brackets (0% to 45%)</li>
                  <li>Calculation structure follows the approach used by French salary calculators such as salaire-brut-en-net.fr</li>
                </ul>
                <p className="font-medium text-amber-700 mt-4">
                  These are simplified estimates. Actual take-home pay depends on individual circumstances including
                  marital status, dependents, supplementary pension contributions, and other factors not captured in the MVP.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost-of-living">
              <h2><AccordionTrigger className="text-left">Cost of Living Indices</AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Cost of living data is presented as comparative indices on a 0-100 scale, inspired by the approach used by
                  Numbeo and similar platforms. These indices are relative measures designed for comparison between cities.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Overall Cost of Living Index: Composite measure of consumer prices</li>
                  <li>Rent Index: Housing rental costs relative to other cities</li>
                  <li>Groceries Index: Food and household shopping costs</li>
                  <li>Transport Index: Public transport and commuting costs</li>
                  <li>Dining Index: Restaurant and eating-out costs</li>
                </ul>
                <p>
                  A higher index value means higher costs. These are not monthly budget estimates but relative positioning
                  metrics for comparison purposes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="quiz">
              <h2><AccordionTrigger className="text-left">Quiz &amp; Recommendation Engine</AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  The recommendation quiz uses a weighted scoring system across nine dimensions: affordability, safety,
                  weather, salary potential, family fit, expat fit, city energy, international vibe, and public transport.
                </p>
                <p>
                  Each quiz answer assigns positive or negative weights to relevant dimensions. These user weights are
                  multiplied by each city's strength profile (scored 1-10) in that dimension to produce a total match score.
                </p>
                <p>
                  The match percentage shows how each city's score compares to the top-scoring city. The algorithm is
                  intentionally transparent and explainable, showing users which dimensions drove their results.
                </p>
                <p>
                  City strength profiles are editorial assessments based on available data and common expat experiences.
                  They will be refined as more data becomes available.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="safety">
              <h2><AccordionTrigger className="text-left">Safety Index</AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Safety indices are composite scores on a 0-100 scale derived from crime statistics, quality of life
                  surveys, and safety perception data. They provide a general indication of relative safety between cities.
                </p>
                <p>
                  Safety varies significantly within cities by neighborhood and time of day. These indices should be used
                  as general guidance, not as definitive safety assessments.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limitations">
              <h2><AccordionTrigger className="text-left">Limitations &amp; Future Updates</AccordionTrigger></h2>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  This MVP covers only the Netherlands and France with four cities. The platform is designed to scale
                  to additional EU countries and cities. Key limitations of the current version:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tax calculations are simplified and do not account for all possible deductions and credits</li>
                  <li>Cost of living indices are based on available data and may not reflect recent changes</li>
                  <li>Safety indices are indicative and should be supplemented with current local information</li>
                  <li>Salary data represents median professional salaries and may vary by industry and role</li>
                  <li>The quiz algorithm uses editorial weightings that will be refined over time</li>
                </ul>
                <p>
                  Future versions will include more countries (Germany, Spain, Portugal), advanced salary calculator
                  options, neighborhood-level data, and real-time data updates.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
