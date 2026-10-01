// Everything Melody-specific lives here, so copy and settings can change without touching the pages.

export type Theme = "plaster" | "stone" | "sage";

// Shipping and returns. These feed the Shipping and returns page, the checkout delivery
// estimate and the Google structured data, so the three always agree.
const shipping = {
  handlingDays: { min: 1, max: 3 }, // working days to pack and hand to the courier
  transitDays: { min: 1, max: 3 }, // working days the courier takes within NZ
};
const returns = {
  // 0 = no change-of-mind returns (faulty or damaged items are still put right).
  // Set to e.g. 14 to accept returns within 14 days of delivery; the page and Google data update to match.
  days: 0,
};

export const site = {
  name: "Melody Mitt",
  tagline: "Original art and collected pieces",
  // Google title for the home page (keep under ~60 characters)
  homeTitle: "Melody Mitt | Original Art & Collected Pieces, NZ",
  // Google description for the home page (keep under ~155 characters)
  description:
    "Original artworks and one-of-a-kind collected pieces by New Zealand artist Melody Mitt. Every piece is a single original, couriered NZ-wide.",
  keywords: [
    "Melody Mitt",
    "Melody Mitt art",
    "New Zealand artist",
    "original art NZ",
    "buy art online NZ",
    "NZ art for sale",
    "original paintings NZ",
    "art for interiors",
    "one of a kind homeware NZ",
    "collectables NZ",
  ],
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_NZ",
  currency: "nzd",

  // Colour direction. Try "plaster" (warm beige), "stone" (cool pale grey) or "sage" (soft green-grey).
  theme: "plaster" as Theme,

  contactEmail: "", // e.g. "hello@melodymitt.co.nz", shown in the footer when filled in
  instagram: "", // e.g. "https://instagram.com/melodymitt"

  // Default courier price for new listings (NZD). Melody can change it per listing.
  defaultShippingNzd: 25,
  shipping,
  returns,
  dispatchNote: `Dispatched by tracked courier within ${shipping.handlingDays.max} working days, anywhere in New Zealand.`,

  categories: [
    { id: "art", label: "Art" },
    { id: "objects", label: "Objects" },
    { id: "collectables", label: "Collectables" },
  ],

  // TODO: replace with Melody's own story. Her town, medium and background help Google rank her for local searches.
  about: {
    short:
      "Melody Mitt is a New Zealand artist. Alongside her own original work she finds and offers pieces of lasting value, chosen to live with rather than look past.",
    long: [
      "Melody Mitt is an artist working in New Zealand. Her studio is where every piece on this site begins: her own original artworks, and the objects of value she finds, restores and chooses to pass on.",
      "Everything here is one of one. There are no editions and no restocks, so when a piece sells it is marked with a red dot, the way galleries have always shown that a work has found its home.",
      "Melody photographs and lists each piece herself, and packs every order by hand for tracked courier delivery anywhere in New Zealand.",
    ],
  },
};

export const categoryLabel = (id: string) =>
  site.categories.find((c) => c.id === id)?.label ?? id;
