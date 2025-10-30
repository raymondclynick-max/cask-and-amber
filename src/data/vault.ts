// src/data/vault.ts
export type Cask = {
  id: string;
  displayName: string;
  spirit: "Single Malt" | "Grain" | "Blended Malt";
  region: "Highland" | "Speyside" | "Islay" | "Lowland" | "Campbeltown";
  caskType: "Barrique" | "Hogshead" | "Butt" | "Puncheon" | "Quarter" | "Octave";
  finish?: "Oloroso" | "PX" | "Port" | "Rum" | "Tokaji" | "Virgin Oak";
  ageYears: number;
  volumeL?: number;
  abv?: number;
  rackTempC?: number;
  rackRH?: number;
  image: string;
  status: "In-bond" | "Reserved" | "Fractional" | "Bottling";
  estValueGBP?: number;
};

export const featuredCasks: Cask[] = [
  {
    id: "hv-1997-1",
    displayName: "1997 Highland 1st Fill",
    spirit: "Single Malt",
    region: "Highland",
    caskType: "Barrique",
    finish: "Oloroso",
    ageYears: 27,
    volumeL: 228,
    abv: 54.1,
    rackTempC: 14.8,
    rackRH: 72,
    image: "/img/casks/cask-1.jpg",
    status: "In-bond",
    estValueGBP: 48500,
  },
  {
    id: "sp-2003-2",
    displayName: "2003 Speyside Hogshead",
    spirit: "Single Malt",
    region: "Speyside",
    caskType: "Hogshead",
    ageYears: 21,
    volumeL: 250,
    abv: 52.3,
    rackTempC: 15.2,
    rackRH: 70,
    image: "/img/casks/cask-2.jpg",
    status: "Fractional",
    estValueGBP: 32000,
  },
  {
    id: "is-2011-3",
    displayName: "2011 Islay Refill Butt",
    spirit: "Single Malt",
    region: "Islay",
    caskType: "Butt",
    ageYears: 13,
    volumeL: 500,
    abv: 57.0,
    rackTempC: 13.9,
    rackRH: 74,
    image: "/img/casks/cask-3.jpg",
    status: "Reserved",
    estValueGBP: 27500,
  },
];
