/** @jsx React.createElement */
/* Shared data + icon set for the Expatflix web UI kit */

const Icon = {
  Compass: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76L14 14l-6.24 2.24L10 10z"/></svg>,
  Globe:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>,
  Bar:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M8 14v4M13 10v8M18 6v12"/></svg>,
  Calc:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>,
  Scale:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l4-4-4-4M8 8l-4 4 4 4M14 4l-4 16"/></svg>,
  Pin:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Arrow:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  Check:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>,
  Book:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/><path d="M4 19.5V22h14"/></svg>,
};

const CITIES = [
  { id:'ams', name:'Amsterdam', country:'Netherlands', flag:'🇳🇱', bestFor:'Young professionals, bike-friendly urbanites, English-speaking workplaces.', safety:82, sun:63, col:78, salary:58 },
  { id:'lis', name:'Lisbon',    country:'Portugal',    flag:'🇵🇹', bestFor:'Remote workers and sun-seekers who want a mild coastal capital.',              safety:71, sun:300, col:58, salary:35 },
  { id:'ber', name:'Berlin',    country:'Germany',     flag:'🇩🇪', bestFor:'Culture, creative industries, and a slower big-city rhythm.',                 safety:74, sun:163, col:68, salary:54 },
  { id:'par', name:'Paris',     country:'France',      flag:'🇫🇷', bestFor:'Big careers, schools, and dense public transit.',                             safety:67, sun:180, col:82, salary:52 },
  { id:'bud', name:'Budapest',  country:'Hungary',     flag:'🇭🇺', bestFor:'Low cost of living, strong food scene, central Europe access.',               safety:78, sun:200, col:45, salary:22 },
  { id:'bar', name:'Barcelona', country:'Spain',       flag:'🇪🇸', bestFor:'Coast + city, design culture, long shoulder seasons.',                        safety:70, sun:260, col:65, salary:38 },
  { id:'cop', name:'Copenhagen',country:'Denmark',     flag:'🇩🇰', bestFor:'High quality of life, cycling culture, excellent schools.',                   safety:85, sun:180, col:88, salary:62 },
  { id:'vie', name:'Vienna',    country:'Austria',     flag:'🇦🇹', bestFor:'Family life, transit, affordable rent for a capital.',                        safety:83, sun:175, col:60, salary:48 },
];

const COUNTRIES = [
  { slug:'netherlands', name:'Netherlands', flag:'🇳🇱', cities: 6, summary:'Flat, efficient, English-ready. Strong public services and international schools in the Randstad.' },
  { slug:'portugal',    name:'Portugal',    flag:'🇵🇹', cities: 4, summary:'Mild climate, D7/NHR visas, a warm welcome for remote workers settling along the coast.' },
  { slug:'germany',     name:'Germany',     flag:'🇩🇪', cities: 5, summary:"Europe's largest economy. Strong labour protections, structured tax system, regional variety." },
  { slug:'france',      name:'France',      flag:'🇫🇷', cities: 4, summary:'Universal healthcare, centralised administration, rich school system, four real seasons.' },
];

const QUIZ = [
  { q:'What matters most right now?',   sub:'Pick the closest. You can refine later.', options:['Career & salary','Family & schools','Cost of living','Lifestyle & culture'] },
  { q:'Climate preference',              sub:'',                                        options:['Warm & sunny','Mild, four seasons','Cool northern','No preference'] },
  { q:'City size',                       sub:'',                                        options:['Large capital','Mid-size city','Smaller, calmer','Open to any'] },
  { q:'Language comfort',                sub:'',                                        options:['English-first workplaces','Willing to learn','Already speak an EU language','Multilingual is fine'] },
];

Object.assign(window, { Icon, CITIES, COUNTRIES, QUIZ });
