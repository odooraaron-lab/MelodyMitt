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
  // Days after shipping that buyers get a "how does it look?" email with new pieces (needs CRON_SECRET).
  followUpDays: 14,
  dispatchNote: `Dispatched by tracked courier within ${shipping.handlingDays.max} working days, anywhere in New Zealand.`,

  // What kind of thing a piece is. Each gets its own page at /shop/category/<id>.
  // "intro" is shown on that page and used as its Google description.
  categories: [
    {
      id: "art",
      label: "Art",
      title: "Original art for sale",
      intro: "Original paintings and works on paper by New Zealand artist Melody Mitt. Every piece is one of one.",
    },
    {
      id: "objects",
      label: "Objects",
      title: "Objects for the home",
      intro: "Vessels, ceramics and well-made things for the home, each chosen to live with for years.",
    },
    {
      id: "collectables",
      label: "Collectables",
      title: "Collectables",
      intro: "Found pieces of value and character, each one of a kind and ready for its next home.",
    },
  ],

  // Art styles, chosen per piece in admin. Each gets its own page at /shop/style/<id>,
  // which helps people searching for, say, "abstract art NZ" find Melody.
  styles: [
    {
      id: "abstract",
      label: "Abstract",
      title: "Abstract art for sale NZ",
      intro: "Original abstract paintings built from colour, shape and texture. One of one, couriered NZ-wide.",
    },
    {
      id: "landscape",
      label: "Landscape",
      title: "Landscape paintings for sale NZ",
      intro: "Original landscape paintings of hills, light and weather, made in New Zealand.",
    },
    {
      id: "coastal",
      label: "Coastal",
      title: "Coastal and seascape art NZ",
      intro: "Original coastal and seascape art: tides, harbours and the light off the water.",
    },
    {
      id: "botanical",
      label: "Botanical",
      title: "Botanical art for sale NZ",
      intro: "Original botanical art of flowers, leaves and native plants, for calm and layered rooms.",
    },
    {
      id: "figurative",
      label: "Figurative",
      title: "Figurative art for sale NZ",
      intro: "Original figurative paintings and drawings of people, gesture and form.",
    },
    {
      id: "still-life",
      label: "Still life",
      title: "Still life paintings for sale NZ",
      intro: "Original still life paintings of tables, vessels and the quiet things around a home.",
    },
  ],

  // Price filters in the menu and shop (NZD, before courier).
  priceBands: [
    { id: "under-300", label: "Under $300", min: 0, max: 29999 },
    { id: "300-to-800", label: "$300 to $800", min: 30000, max: 80000 },
    { id: "over-800", label: "Over $800", min: 80001, max: Number.MAX_SAFE_INTEGER },
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

export const styleLabel = (id: string) => site.styles.find((s) => s.id === id)?.label ?? "";
