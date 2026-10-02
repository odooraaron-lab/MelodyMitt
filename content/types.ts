export type CategoryId =
  | "auckland"
  | "queenstown"
  | "christchurch"
  | "hamilton"
  | "new-plymouth"
  | "tauranga"
  | "whangarei"
  | "art-history"
  | "living-with-art";

export type Post = {
  slug: string;
  title: string; // shown on the page
  seoTitle: string; // Google title, keep under ~48 characters (the site name is added)
  description: string; // Google description, under ~155 characters
  date: string; // YYYY-MM-DD
  category: CategoryId;
  keywords: string[];
  /** Shown under "Popular guides" in the footer */
  featured?: boolean;
  /** Call to action at the end of the post; with a style, a few pieces in that style are shown too */
  shop?: { label: string; href: string; style?: string };
  body: string;
};
