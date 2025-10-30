// shared type + demo data. No React here.
export type Tranche = {
  id: string;
  type: "single_malt" | "blend";
  distilleryOrSeries: string;
  vintageOrBatch: string;
  wood: string;
  abv: number;
  caskSizeL: number;
  pricePerOnePctEUR: number;
  remainingPct: number;      // 0..100
  recordDateISO: string;
  bottlingDateISO: string;
};

export const TRANCHES: Tranche[] = [
  {
    id: "tm-2008-butt",
    type: "single_malt",
    distilleryOrSeries: "Thomas Melvin",
    vintageOrBatch: "2008 • Sherry Butt",
    wood: "European oak",
    abv: 62.5,
    caskSizeL: 500,
    pricePerOnePctEUR: 1425,
    remainingPct: 38,
    recordDateISO: "2026-03-31T16:00:00Z",
    bottlingDateISO: "2026-06-30T16:00:00Z",
  },
  {
    id: "amber-2021-cohort-a",
    type: "blend",
    distilleryOrSeries: "Amber Cohort A",
    vintageOrBatch: "2021 • 1st-fill Bourbon",
    wood: "American oak",
    abv: 63.0,
    caskSizeL: 200,
    pricePerOnePctEUR: 420,
    remainingPct: 72,
    recordDateISO: "2026-02-15T16:00:00Z",
    bottlingDateISO: "2026-05-15T16:00:00Z",
  },
];
