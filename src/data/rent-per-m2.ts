/**
 * Rent per m² (city-centre residential, €/m²/month) for the 24 cities
 * that do not yet have a full CityMetrics JSON file.
 *
 * These are used as fallback values in getCostOfLiving() and comparison
 * dimensions when getCityMetrics() returns null.
 *
 * Source priority per city:
 *   high   = official statistics office / government observatory
 *   medium = large-sample property portal (Pararius, Idealista, ImmoScout24, etc.)
 *
 * Last reviewed: 2026-05-08
 */

export interface RentPerM2Entry {
  perM2CityCenter: number;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: "official_statistical" | "official_operator" | "market_report" | "crowdsourced";
  sourceDate: string;
  confidence: "high" | "medium" | "low";
}

const RENT_PER_M2_DATA: Record<string, RentPerM2Entry> = {
  // ── Netherlands ────────────────────────────────────────────────────────────
  rotterdam: {
    perM2CityCenter: 26,
    sourceLabel: "Rent.nl / Pararius Huurmonitor Q1 2025",
    sourceUrl: "https://www.rent.nl/en/huurindex/q1-2025-rotterdam/",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },
  "the-hague": {
    perM2CityCenter: 25,
    sourceLabel: "Rent.nl / Pararius Huurmonitor Q1 2025",
    sourceUrl: "https://www.rent.nl/en/huurindex/q1-2025-den-haag/",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },
  eindhoven: {
    perM2CityCenter: 20,
    sourceLabel: "Pararius Huurmonitor Q4 2025",
    sourceUrl: "https://www.pararius.com/expat-guide/rental-report-q1-2025",
    sourceType: "market_report",
    sourceDate: "2025-Q4",
    confidence: "medium",
  },
  utrecht: {
    perM2CityCenter: 27,
    sourceLabel: "Rent.nl / Pararius Huurmonitor Q1 2025",
    sourceUrl: "https://www.rent.nl/en/huurindex/q1-2025-utrecht/",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },

  // ── France — Observatoire des loyers (OLL/INSEE) ────────────────────────────
  lyon: {
    perM2CityCenter: 18,
    sourceLabel: "Observatoire des loyers de Lyon (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomeration-de-lyon/lyon-69123",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  bordeaux: {
    perM2CityCenter: 16,
    sourceLabel: "Observatoire des loyers de Bordeaux (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomeration-de-bordeaux",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  marseille: {
    perM2CityCenter: 15,
    sourceLabel: "Observatoire des loyers Aix-Marseille-Provence (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomerations-daix-marseille-et-darles/marseille-13055",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  lille: {
    perM2CityCenter: 15,
    sourceLabel: "Observatoire des loyers de Lille (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomeration-de-lille/lille-59350",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  nantes: {
    perM2CityCenter: 13,
    sourceLabel: "Observatoire locatif privé Nantes — CINA/Auran (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomeration-de-nantes/nantes-44109",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  nice: {
    perM2CityCenter: 18,
    sourceLabel: "Observatoire des loyers Alpes-Maritimes (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/departement-des-alpes-maritimes/nice-06088",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  strasbourg: {
    perM2CityCenter: 13,
    sourceLabel: "Observatoire des loyers du Bas-Rhin (OLL/INSEE) 2024",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/eurometropole-de-strasbourg/strasbourg-67482",
    sourceType: "official_statistical",
    sourceDate: "2024-01-01",
    confidence: "high",
  },
  annecy: {
    perM2CityCenter: 15,
    sourceLabel: "Observatoire des loyers d'Annecy (OLL/INSEE) 2025",
    sourceUrl: "https://www.observatoires-des-loyers.org/connaitre-les-loyers/carte-des-niveaux-de-loyers/agglomeration-dannecy",
    sourceType: "official_statistical",
    sourceDate: "2025-01-01",
    confidence: "high",
  },

  // ── Germany ─────────────────────────────────────────────────────────────────
  frankfurt: {
    perM2CityCenter: 17,
    sourceLabel: "ImmoScout24 Mietspiegel Frankfurt Innenstadt 2025",
    sourceUrl: "https://www.immobilienscout24.de/immobilienpreise/hessen/frankfurt-am-main/innenstadt-i/innenstadt/mietspiegel",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },
  stuttgart: {
    perM2CityCenter: 17,
    sourceLabel: "Landeshauptstadt Stuttgart Mietspiegel 2025/2026",
    sourceUrl: "https://www.stuttgart.de/service/statistik-und-wahlen/mietspiegel",
    sourceType: "official_statistical",
    sourceDate: "2025-01-01",
    confidence: "medium",
  },

  // ── Italy ───────────────────────────────────────────────────────────────────
  rome: {
    perM2CityCenter: 20,
    sourceLabel: "Immobiliare.it mercato immobiliare Roma 2025",
    sourceUrl: "https://www.immobiliare.it/en/mercato-immobiliare/lazio/roma/",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },
  milan: {
    perM2CityCenter: 26,
    sourceLabel: "Immobiliare.it mercato immobiliare Milano 2026",
    sourceUrl: "https://investropa.com/blogs/news/milan-rents",
    sourceType: "market_report",
    sourceDate: "2026-Q1",
    confidence: "medium",
  },
  torino: {
    perM2CityCenter: 16,
    sourceLabel: "Immobiliare.it mercato immobiliare Torino Centro 2025",
    sourceUrl: "https://www.immobiliare.it/en/mercato-immobiliare/piemonte/torino/centro/",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },

  // ── Spain ───────────────────────────────────────────────────────────────────
  madrid: {
    perM2CityCenter: 25,
    sourceLabel: "Idealista informe alquiler Madrid 2025",
    sourceUrl: "https://www.idealista.com/sala-de-prensa/informes-precio-vivienda/alquiler/madrid-comunidad/madrid-provincia/madrid/",
    sourceType: "market_report",
    sourceDate: "2025-Q3",
    confidence: "medium",
  },
  valencia: {
    perM2CityCenter: 16,
    sourceLabel: "Idealista informe alquiler Valencia 2025",
    sourceUrl: "https://www.idealista.com/sala-de-prensa/informes-precio-vivienda/alquiler/comunitat-valenciana/valencia-valencia/",
    sourceType: "market_report",
    sourceDate: "2025-Q4",
    confidence: "medium",
  },

  // ── Belgium ─────────────────────────────────────────────────────────────────
  antwerp: {
    perM2CityCenter: 18,
    sourceLabel: "CIB Huurbarometer Vlaanderen S1 2025",
    sourceUrl: "https://community.cib.be/actua/news/3fd5cdef-8a5a-4e20-bd59-43f26e05b396",
    sourceType: "market_report",
    sourceDate: "2025-Q2",
    confidence: "medium",
  },

  // ── Switzerland (CHF converted at 1.03 CHF = 1 EUR) ────────────────────────
  geneva: {
    perM2CityCenter: 48,
    sourceLabel: "Homegate / Investropa Geneva rents 2026 (CHF 50 ÷ 1.03)",
    sourceUrl: "https://investropa.com/blogs/news/geneva-rents",
    sourceType: "market_report",
    sourceDate: "2026-Q1",
    confidence: "medium",
  },
  zurich: {
    perM2CityCenter: 30,
    sourceLabel: "City of Zurich rent survey / Mietencheck 2024 (CHF 31 ÷ 1.03)",
    sourceUrl: "https://www.mietencheck.ch/en/blog/understanding-zurich-rent-prices",
    sourceType: "market_report",
    sourceDate: "2024-01-01",
    confidence: "medium",
  },

  // ── Portugal ────────────────────────────────────────────────────────────────
  porto: {
    perM2CityCenter: 17,
    sourceLabel: "Idealista arrendamento Porto 2025",
    sourceUrl: "https://portorealestate.pt/mercado-imobiliario-no-porto-em-2025/",
    sourceType: "market_report",
    sourceDate: "2025-Q4",
    confidence: "medium",
  },

  // ── Sweden (SEK converted at 0.087 SEK = 1 EUR) ────────────────────────────
  stockholm: {
    perM2CityCenter: 17,
    sourceLabel: "SCB (Statistics Sweden) / Bofrid market data 2025 (~200 SEK ÷ 0.087)",
    sourceUrl: "https://bofrid.se/en/rent-prices",
    sourceType: "market_report",
    sourceDate: "2025-Q1",
    confidence: "medium",
  },
};

/** Return the rent/m² entry for a city slug, or null if unknown. */
export function getRentPerM2(slug: string): RentPerM2Entry | null {
  return RENT_PER_M2_DATA[slug] ?? null;
}
