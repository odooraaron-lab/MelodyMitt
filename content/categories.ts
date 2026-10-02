import type { CategoryId } from "./types";

export type Category = {
  id: CategoryId;
  label: string;
  /** Page heading and the start of the Google title */
  title: string;
  seoTitle: string;
  intro: string;
  /** Short line for chips and menus */
  blurb: string;
};

// The journal is organised by place first, because people search for art "in" a city.
export const categories: Category[] = [
  {
    id: "whangarei",
    label: "Whangārei",
    title: "Whangārei and Northland art guides",
    seoTitle: "Whangārei and Northland Art Guides",
    intro:
      "Galleries, art trails, printmaking and the Hundertwasser Art Centre: guides to the art scene in Whangārei and Northland, written from the studio of Whangārei artist Melody Mitt.",
    blurb: "Galleries, trails and studios in Northland",
  },
  {
    id: "auckland",
    label: "Auckland",
    title: "Auckland art guides",
    seoTitle: "Auckland Art Guides: Galleries, Buying and Hanging",
    intro:
      "Where to see original art in Auckland, how to buy it well, and how to hang and care for it in villas, apartments and humid coastal homes across Tāmaki Makaurau.",
    blurb: "Galleries, buying and hanging art in Tāmaki Makaurau",
  },
  {
    id: "queenstown",
    label: "Queenstown",
    title: "Queenstown and Central Otago art guides",
    seoTitle: "Queenstown and Central Otago Art Guides",
    intro:
      "Galleries in Queenstown and Arrowtown, art for alpine homes and holiday houses, and practical advice on protecting and shipping art in the Southern Lakes.",
    blurb: "Queenstown, Arrowtown and the Southern Lakes",
  },
  {
    id: "christchurch",
    label: "Christchurch",
    title: "Christchurch and Canterbury art guides",
    seoTitle: "Christchurch and Canterbury Art Guides",
    intro:
      "Galleries and street art in Ōtautahi Christchurch, plus earthquake-safe hanging, art for Canterbury villas, and caring for art through damp southern winters.",
    blurb: "Ōtautahi galleries, street art and safe hanging",
  },
  {
    id: "hamilton",
    label: "Hamilton",
    title: "Hamilton and Waikato art guides",
    seoTitle: "Hamilton and Waikato Art Guides",
    intro:
      "Waikato Museum, Hamilton Gardens and the Waikato Society of Arts, plus how to choose and buy original art for new-build homes and river-city living.",
    blurb: "Kirikiriroa galleries, gardens and river colours",
  },
  {
    id: "new-plymouth",
    label: "New Plymouth",
    title: "New Plymouth and Taranaki art guides",
    seoTitle: "New Plymouth and Taranaki Art Guides",
    intro:
      "The Govett-Brewster, the Len Lye Centre, the Wind Wand and the Coastal Arts Trail, plus art for Taranaki's surf coast and mountain-view homes.",
    blurb: "Len Lye, the Coastal Walkway and Taranaki colours",
  },
  {
    id: "tauranga",
    label: "Tauranga",
    title: "Tauranga and Bay of Plenty art guides",
    seoTitle: "Tauranga and Bay of Plenty Art Guides",
    intro:
      "Tauranga Art Gallery, the Katikati murals, sculpture parks and art for beach homes at Mount Maunganui and Papamoa across the Bay of Plenty.",
    blurb: "Galleries, murals and beach-house art",
  },
  {
    id: "art-history",
    label: "Art history",
    title: "Art history and art education",
    seoTitle: "Art History and Art Education Explained",
    intro:
      "The École des Beaux-Arts, life drawing, classical proportion and how artists learn their craft, explained plainly for people who simply love art.",
    blurb: "The Beaux-Arts tradition and how artists train",
  },
  {
    id: "living-with-art",
    label: "Living with art",
    title: "Living with art: choosing, hanging and styling",
    seoTitle: "Living With Art: Choosing, Hanging and Styling",
    intro:
      "Practical guides to choosing, framing, hanging, styling, gifting and caring for original art in New Zealand homes.",
    blurb: "Choosing, hanging and styling original art",
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id) ?? null;
