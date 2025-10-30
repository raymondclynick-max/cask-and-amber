// Types reused across app
export type FlavorAxis = "Citrus" | "Honey" | "Smoke" | "Spice" | "Dried Fruit" | "Vanilla";
export type Cask = {
  id: string;
  distillery: string;
  region: "Speyside" | "Islay" | "Highland" | "Lowland" | "Islands" | "Campbeltown" | "Other";
  spiritType: "Single Malt" | "Grain" | "Blend";
  caskType: string;
  age: number;
  abv: number;
  volumeL: number;
  priceEUR: number;
  warehouse: string;
  coords?: { xPct: number; yPct: number };
  image: string;               // path under /public
  status: "available" | "reserved" | "sold";
  nose: string;
  palate: string;
  finish: string;
  flavorSpider: Record<FlavorAxis, number>;
};

// Single source of truth
export const CASKS: Cask[] = [
  {
    id: "CA-25-001",
    distillery: "Strathvale",
    region: "Speyside",
    spiritType: "Single Malt",
    caskType: "First-Fill Sherry Butt",
    age: 12,
    abv: 63.4,
    volumeL: 480,
    priceEUR: 7200,
    warehouse: "Perth, Scotland",
    coords: { xPct: 32, yPct: 18 },
    image: "/img/casks/strathvale-12.jpg",
    status: "available",
    nose: "Raisin, orange peel, roasted hazelnut.",
    palate: "Silky sherry, baked apple, clove.",
    finish: "Long with cocoa and walnut bitters.",
    flavorSpider: { Citrus: 6, Honey: 7, Smoke: 1, Spice: 6, "Dried Fruit": 8, Vanilla: 4 },
  },
  {
    id: "CA-25-002",
    distillery: "Kirk Ness",
    region: "Islay",
    spiritType: "Single Malt",
    caskType: "Refill Bourbon Hogshead",
    age: 10,
    abv: 62.1,
    volumeL: 250,
    priceEUR: 6400,
    warehouse: "Campbeltown",
    coords: { xPct: 26, yPct: 28 },
    image: "/img/casks/kirk-ness-10.jpg",
    status: "available",
    nose: "Sea spray, iodine, lemon.",
    palate: "Peat smoke, vanilla cream, pepper.",
    finish: "Ashy with lingering brine.",
    flavorSpider: { Citrus: 5, Honey: 3, Smoke: 9, Spice: 5, "Dried Fruit": 2, Vanilla: 5 },
  },
  {
    id: "CA-25-003",
    distillery: "Glen Rowan",
    region: "Highland",
    spiritType: "Single Malt",
    caskType: "Ex-Bourbon Barrel",
    age: 15,
    abv: 60.8,
    volumeL: 190,
    priceEUR: 8900,
    warehouse: "Perth, Scotland",
    coords: { xPct: 33, yPct: 22 },
    image: "/img/casks/glen-rowan-15.jpg",
    status: "reserved",
    nose: "Heather honey, pear, vanilla pod.",
    palate: "Toffee, almond, hint of oak spice.",
    finish: "Warming with citrus oils.",
    flavorSpider: { Citrus: 6, Honey: 8, Smoke: 1, Spice: 4, "Dried Fruit": 3, Vanilla: 7 },
  },
];
