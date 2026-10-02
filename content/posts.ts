// Journal posts. The guides on living with art are below; the city and art-history guides live in content/archive/<year>.ts.
// To add one, copy an entry, give it a new slug and date, pick a category (see content/categories.ts) and write the body.
// Body format: blank line between paragraphs, "## " for headings, "- " for list items,
// **bold**, *italic*, and [link text](/shop).

import type { Post, CategoryId } from "./types";
import { posts2017 } from "./archive/2017";
import { posts2018 } from "./archive/2018";
import { posts2019 } from "./archive/2019";
import { posts2020 } from "./archive/2020";
import { posts2021 } from "./archive/2021";
import { posts2022 } from "./archive/2022";
import { posts2023 } from "./archive/2023";
import { posts2024 } from "./archive/2024";
import { posts2025 } from "./archive/2025";

export type { Post, CategoryId };

const livingPosts: Post[] = [
  {
    slug: "how-to-choose-original-art-for-your-living-room",
    category: "living-with-art",
    title: "How to choose original art for your living room",
    seoTitle: "How to Choose Original Art for Your Living Room",
    description:
      "A practical guide to choosing original art for a living room: size, colour, placement and how to trust your own eye when buying art in NZ.",
    date: "2026-10-01",
    keywords: ["art for living room", "choosing art NZ", "original art for home", "interior design art"],
    featured: true,
    shop: { label: "Browse original art", href: "/shop/category/art" },
    body: `
The living room is where most people hang the first piece of art they really care about. It is the room guests see, the room you sit in at the end of the day, and usually the room with the biggest blank wall. That makes it the place where a good choice pays off most, and where a rushed one is hardest to ignore.

## Start with the wall, not the artwork

Measure the wall before you start looking. Note what sits under it: a sofa, a sideboard, nothing at all. A piece above furniture usually looks right when it spans around two thirds of the furniture's width. On a bare wall you have more freedom, but a single piece should still feel generous rather than lost.

If you fall for something smaller than the space wants, that's fine. Pair it with a second piece, or let it sit off-centre above a lamp or a stack of books so it feels deliberate.

## Let colour connect, not match

You don't need art that matches your cushions. The rooms that feel most considered usually pick up one colour from the room and let the rest of the artwork bring something new. A calm, neutral room can carry a piece with real depth of colour. A busy room often benefits from something quieter and more textural.

## Think about light

Look at where the light comes from during the day. Strong afternoon sun will fade works on paper over time, so save that wall for pieces under UV-filtering glass, or for objects that cope with light. In the evening, a single lamp angled towards a painting changes the whole mood of a room.

## Buy what you keep looking at

The most reliable test is simple: which piece do you keep coming back to? Original art isn't a cushion you'll swap next season. It is something you will live with for years, so trust the work that holds your attention, not the one that feels safest.

Every piece in the [shop](/shop) is a single original, so when you find the one you keep looking at, there's no second copy waiting. If you'd like to know more about how pieces are chosen and made, read [about Melody](/about).
`,
  },
  {
    slug: "how-high-to-hang-art",
    category: "living-with-art",
    title: "How high to hang art: a simple guide that works in any room",
    seoTitle: "How High to Hang Art: A Simple Guide for Any Room",
    description:
      "The gallery rule for hanging art at the right height, plus how to hang above a sofa, bed or sideboard. Easy steps for NZ homes.",
    date: "2026-09-24",
    keywords: ["how high to hang art", "hanging art above sofa", "picture hanging guide", "art placement"],
    featured: true,
    shop: { label: "Find a piece to hang", href: "/shop" },
    body: `
Most art in most homes is hung too high. It's an easy mistake: we look up at walls, so we hang things up there. Galleries solve this with one simple rule, and it works just as well at home.

## The gallery rule: centre at eye level

Hang the work so its centre sits about 145 to 150 cm from the floor. That's roughly average eye level, and it's the height most galleries use. It keeps art connected to the people in the room instead of floating near the ceiling.

To work it out:

- Measure the artwork's height and halve it.
- Measure from the top of the frame down to the taut hanging wire or D-ring.
- Your hook goes at 145 cm, plus half the height, minus the wire drop.

Write the numbers down before you pick up the drill. It saves a lot of filler.

## Above a sofa or sideboard

When art hangs over furniture, the furniture becomes the anchor. Leave a gap of about 15 to 25 cm between the top of the sofa or sideboard and the bottom of the frame. Any more and the two stop relating to each other; any less and the art feels cramped.

## Above a bed

Bedheads vary, so measure from the top of the bedhead and leave a similar 15 to 25 cm gap. Choose something securely hung with two points of fixing, and avoid heavy glass frames directly over where you sleep.

## In hallways and stairwells

Hallways are viewed while moving, so keep to the same eye-level centre and space pieces evenly. On stairs, keep that same height above each step, so the line of art follows the slope of the staircase.

## Use the right fixings

Many New Zealand homes have plasterboard walls. For anything heavier than a small frame, find a stud or use picture hooks rated for the weight. Older villas and bungalows may have lath and plaster or timber-lined walls, which behave differently, so test before you commit.

Once you've got the height right, the next question is what to hang. Browse the [current pieces](/shop), each one an original.
`,
  },
  {
    slug: "original-art-vs-prints",
    category: "living-with-art",
    title: "Original art or a print? Why one-of-a-kind pieces are worth it",
    seoTitle: "Original Art vs Prints: Why One-of-a-Kind Wins",
    description:
      "What you actually get when you buy original art instead of a print, and how to start a collection of original work in New Zealand.",
    date: "2026-09-16",
    keywords: ["original art vs prints", "buy original art NZ", "why buy original art", "art collecting NZ"],
    shop: { label: "Browse original art", href: "/shop/category/art" },
    body: `
Prints have their place. They make good art affordable and widely available, and plenty of beautiful homes are built around them. But there is a real difference between a print and an original, and it's worth understanding before you buy.

## What an original gives you

An original is the thing itself: the surface the artist actually worked on. You see the texture of the paint, the pressure of a line, the places where something was changed or left raw. Those details don't survive reproduction, and they are what makes a work feel alive in a room.

It is also singular. Nobody else has it. Your friend can't buy the same one online next week, and it will never turn up in a chain store.

## It holds its value differently

A mass-produced print is worth what it cost to make. An original carries the value of the artist's time, skill and story. That doesn't mean every work is an investment, and you should never buy art only for that reason. But an original is far more likely to keep its worth, to be passed down, and to mean something to the people who inherit it.

## You're supporting a working artist directly

When you buy an original from an artist, the money goes to the person who made it. That supports their next piece of work, and it keeps independent art practice possible in New Zealand.

## Starting small

Originals don't have to mean a huge canvas or a gallery price. Smaller works, studies and works on paper are a lovely way to begin. Objects of craft and value count too: a well-made vessel, a found piece with a history, something chosen with care.

Start with one piece you love, give it a good spot, and let the collection grow slowly.

Every listing in the [shop](/shop) is one of one. When it sells, it's marked with a red dot and stays on the site as a record of where it went.
`,
  },
  {
    slug: "gallery-wall-ideas",
    category: "living-with-art",
    title: "Gallery wall ideas: how to make it feel collected, not cluttered",
    seoTitle: "Gallery Wall Ideas: Collected, Not Cluttered",
    description:
      "How to plan a gallery wall that feels considered: choosing pieces, spacing, layout styles and mixing original art with objects.",
    date: "2026-09-07",
    keywords: ["gallery wall ideas", "gallery wall layout", "art wall NZ", "styling art at home"],
    featured: true,
    shop: { label: "Smaller pieces under $300", href: "/shop?price=under-300" },
    body: `
A good gallery wall looks like it grew over time, even if you hung it in an afternoon. A bad one looks like a stock photo. The difference is mostly in the planning.

## Choose a thread

The pieces don't need to match, but they should share something: a palette, a subject, a material, or simply the fact that you chose each one. A mix of original paintings, drawings and a small object or two often feels richer than a set of identical frames.

## Pick a layout style

- **Grid:** identical frames in neat rows. Calm and architectural, best for a series.
- **Salon:** mixed sizes clustered tightly together. Relaxed and personal, and forgiving as the collection grows.
- **Single line:** pieces of different sizes aligned along one horizontal line, top, centre or bottom. Tidy without being rigid.

## Keep the gaps consistent

Spacing is what makes a gallery wall look intentional. Keep 5 to 8 cm between pieces and stick to it. Consistent gaps let varied frames sit together without looking chaotic.

## Plan on the floor first

Lay everything out on the floor until the arrangement feels balanced. Put your largest or strongest piece slightly off-centre as an anchor, then build outwards. Trace each frame onto paper, tape the templates to the wall, and live with it for a day before you drill.

## Leave room to grow

A gallery wall doesn't have to be finished. Leave a little space on one edge so a future piece can join it. Some of the best walls are added to over years.

## Mix in objects

A small shelf or ledge within the arrangement lets you bring in a vessel, a sculpture or a found object. It breaks up the flat surface and makes the wall feel lived in.

Looking for a first anchor piece? See what's [available now](/shop).
`,
  },
  {
    slug: "warm-neutral-interiors-and-art",
    category: "living-with-art",
    title: "Warm neutral interiors: how art adds depth to a calm room",
    seoTitle: "Warm Neutral Interiors: How Art Adds Depth",
    description:
      "Beige, oatmeal and stone interiors are calm but can fall flat. Here's how original art and objects bring depth, texture and warmth.",
    date: "2026-08-28",
    keywords: ["neutral interior design", "beige interior", "warm neutral living room", "art for neutral rooms"],
    shop: { label: "Shop abstract art", href: "/shop/style/abstract", style: "abstract" },
    body: `
Warm neutrals have become the backdrop of choice for many New Zealand homes: oatmeal linen, limewashed walls, pale timber, stone. They're restful, they suit our light, and they age well. But a room built entirely from beige can start to feel flat. Art is the easiest way to fix that.

## Neutral rooms need contrast

A neutral palette works best when something in the room provides contrast. That can be a darker artwork, a strong line, or a piece with a surface you want to touch. Without it, the eye has nowhere to rest and the room can feel unfinished.

## Texture counts as much as colour

You don't have to introduce bright colour to bring a neutral room to life. Heavy brushwork, raw canvas, carved timber, glazed ceramics and worn metal all add depth while keeping the palette calm. Original work is especially good at this because its surface is real, not printed.

## Choose a few deeper tones

Look at the undertones already in your room. Warm neutrals pair beautifully with:

- Ochre, rust and tobacco brown
- Olive and moss greens
- Charcoal and ink blue
- Aged brass and dark timber

A single artwork that carries one of these tones can tie the whole room together.

## Let objects do some of the work

Not every wall needs a painting. A well-chosen object on a sideboard or shelf, something with age, weight or craft behind it, can carry as much presence as a framed work. Group objects in odd numbers and vary their heights.

## Edit as you go

Calm rooms are calm because of what's left out. When you bring in a new piece, consider moving something else on. A neutral room with fewer, better things will always feel more considered than one with many.

Browse [art and objects](/shop) chosen with calm, layered rooms in mind.
`,
  },
  {
    slug: "caring-for-original-art-nz-homes",
    category: "living-with-art",
    title: "How to care for original artwork in a New Zealand home",
    seoTitle: "How to Care for Original Art in a New Zealand Home",
    description:
      "Simple ways to protect original art from sun, damp and condensation in NZ homes, plus where not to hang it and how to clean it.",
    date: "2026-08-19",
    keywords: ["caring for artwork", "protect art from sun", "art care NZ", "damp and condensation art"],
    shop: { label: "See all available pieces", href: "/shop" },
    body: `
Original art is made to last, but it does need a little care, and New Zealand homes have a few particular challenges. Strong UV, winter condensation and damp older houses are the usual culprits. A few habits will keep your pieces in good shape for decades.

## Watch the sun

New Zealand's UV is strong, even through glass. Direct sun fades pigments and yellows paper over time. Hang works on paper and photographs away from direct sunlight, or have them framed behind UV-filtering glass. Oil and acrylic paintings are tougher but still benefit from some distance from a sunny window.

## Keep it dry and steady

Damp is the enemy of art. Mould can grow on the back of canvases and inside frames, especially on cold exterior walls in winter. To help:

- Avoid bathrooms, laundries and directly above kitchen benches.
- Don't hang above a heat pump, fireplace or heater, where air is hot and dry one moment and cool the next.
- In damp rooms, a dehumidifier and regular airing make a real difference.
- Leave a small air gap behind frames on exterior walls. Small felt or cork bumpers on the lower corners work well.

## Handle it gently

Hold framed works by both sides, never by the top of the frame. Carry canvases by the stretcher bars rather than pressing on the painted surface. Clean hands matter: oils from skin can mark paper and unvarnished paint.

## Cleaning

Dust paintings occasionally with a soft, dry brush. Never use water, sprays or household cleaners on the artwork itself. For glass, spray cleaner onto a cloth rather than the glass, so nothing seeps under the frame.

## When to call a professional

If you notice flaking paint, mould spots, buckling paper or tears, stop and contact a professional conservator or framer rather than trying a home fix.

Every piece from the [shop](/shop) is packed carefully for its courier trip. Once it's home, these habits will keep it looking the way it did on the day it arrived.
`,
  },
  {
    slug: "ways-to-style-original-art-at-home",
    category: "living-with-art",
    title: "10 ways to style original art at home",
    seoTitle: "10 Ways to Style Original Art at Home",
    description:
      "Ten simple, designer-tested ways to style original art at home, from leaning and layering to lighting, scale and unexpected rooms.",
    date: "2026-09-28",
    keywords: ["how to style art at home", "art styling ideas", "wall art ideas NZ", "decorating with art"],
    featured: true,
    shop: { label: "See all available pieces", href: "/shop" },
    body: `
Good styling makes a single piece of art feel considered rather than just hung. None of these ideas need a designer or a big budget. Most need nothing more than a second look at a wall you already walk past every day.

## 1. Lean, don't always hang

A painting leaning on a sideboard, mantel or deep shelf feels relaxed and easy to change. Layer a smaller piece slightly in front of a larger one for depth.

## 2. Go bigger than you think

One generous artwork almost always looks better than several small ones scattered around. If you're torn between two sizes, the larger one is usually right. See our guide on [how high to hang art](/journal/how-high-to-hang-art) to place it well.

## 3. Hang art in unexpected rooms

Kitchens, laundries, hallways and the space beside the bed all deserve something to look at. Choose sturdier pieces for busy rooms and keep works on paper away from steam.

## 4. Light it

A single lamp angled at a painting changes a room at night. Picture lights and adjustable spotlights work well, but even moving an existing lamp can be enough.

## 5. Let art set the palette

Instead of choosing art to match a room, try the reverse: pick a piece you love, then pull two or three of its colours into cushions, throws or a vase.

## 6. Pair art with objects

A painting above a sideboard looks finished once there's something beneath it: a lamp, a stack of books, a vessel with a branch. Odd numbers and varied heights work best.

## 7. Mix styles with a common thread

An [abstract](/shop/style/abstract) piece can sit happily beside a [landscape](/shop/style/landscape) if they share a colour, a mood or a frame finish. The thread is what makes a mix look intentional.

## 8. Give it space

Not every wall needs filling. A single piece on an otherwise empty wall reads as confident. Resist the urge to crowd it.

## 9. Rotate with the seasons

Swap pieces between rooms every few months. Art you've stopped noticing in the hallway can feel new again in the bedroom.

## 10. Start a collection slowly

The most interesting homes are built over years. Buy one piece you love, live with it, then add the next. A [gallery wall](/journal/gallery-wall-ideas) is a good way to let a collection grow.

Looking for the piece to start with? Every listing in the [shop](/shop) is one of one.
`,
  },
  {
    slug: "how-to-choose-a-frame-for-art",
    category: "living-with-art",
    title: "How to choose a frame for original art",
    seoTitle: "How to Choose a Frame for Original Art",
    description:
      "Frame or no frame? How to choose frame colour, width, mats and glass for original paintings and works on paper, plus when to leave a canvas bare.",
    date: "2026-09-20",
    keywords: ["how to frame a painting", "framing art NZ", "picture frame ideas", "choosing a frame"],
    shop: { label: "Browse original art", href: "/shop/category/art" },
    body: `
A frame does two jobs: it protects the artwork, and it bridges the gap between the art and your room. The right one disappears. The wrong one is all you notice.

## Does it need a frame at all?

Paintings on stretched canvas with painted edges often look best unframed, especially in modern rooms. Works on paper, photographs and anything delicate should always be framed behind glass for protection.

## Choose the frame for the art, not the room

Start with the artwork. Look at its strongest colour, its texture and its scale. A quiet, loose painting suits a slim, simple frame. A bold, graphic piece can carry something heavier. Your room comes second, though it's worth keeping frame finishes broadly consistent across a wall.

## Colours that rarely go wrong

- **Natural timber** such as oak or ash: warm, relaxed and kind to most palettes.
- **Black:** crisp and modern, good for graphic work and drawings.
- **White or off-white:** light and gallery-like, lovely on pale walls.
- **Brass or gold:** use sparingly, for pieces with warmth or a sense of history.

## Mats give art room to breathe

A mat (the card border between artwork and frame) makes smaller works feel more important and stops paper touching the glass. Generous mats of 5 to 8 cm look considered. Off-white usually works better than bright white.

## Floating frames for canvases

A floating or tray frame leaves a small gap around a canvas so it appears to hover. It adds polish without hiding the painted edges.

## Glass matters

For works on paper, ask your framer for UV-filtering glass, especially in sunny rooms. New Zealand's UV is strong, and our guide on [caring for original art](/journal/caring-for-original-art-nz-homes) explains why.

## When in doubt, ask a framer

A good local framer will lay out samples against the artwork itself. Take the piece with you, not just a photo.

Find something worth framing in the [art collection](/shop/category/art).
`,
  },
  {
    slug: "abstract-art-at-home",
    category: "living-with-art",
    title: "Abstract art at home: how to choose it and where to hang it",
    seoTitle: "Abstract Art at Home: How to Choose and Hang It",
    description:
      "How to choose abstract art you'll love living with, which rooms suit it, and how to pair abstract paintings with a calm, modern NZ interior.",
    date: "2026-09-11",
    keywords: ["abstract art NZ", "abstract wall art", "modern abstract art", "abstract art for living room"],
    featured: true,
    shop: { label: "Shop abstract art", href: "/shop/style/abstract", style: "abstract" },
    body: `
Abstract art asks less of you than people think. You don't need to know what it means. You only need to know whether you want to keep looking at it.

## How to choose abstract art

Ignore the question "what is it?" and ask "how does it make the room feel?" Some abstract work is calm: soft edges, close colours, lots of space. Some is energetic: strong contrast, gesture, movement. Decide which your room needs.

Then look closely. Original abstract paintings reward a second look with texture, layering and small decisions you can't see in a photo. That surface is a big part of why [original art beats a print](/journal/original-art-vs-prints).

## Where abstract art works best

- **Living rooms:** a large abstract piece above a sofa can anchor the whole space.
- **Dining rooms:** colour and energy suit a room built for conversation.
- **Bedrooms:** quieter, softer abstracts are restful to wake up to.
- **Hallways:** a strong, graphic piece makes a short pause feel like an arrival.

## Pairing abstract art with your interior

Abstract work is especially good in [warm neutral rooms](/journal/warm-neutral-interiors-and-art), where it can introduce depth without clutter. Pick one or two colours from the painting and repeat them nearby in textiles or ceramics.

It also mixes well with other styles. A small [landscape](/shop/style/landscape) or [botanical](/shop/style/botanical) piece beside an abstract one can look wonderful if they share a tone.

## Getting the scale right

Abstract art tends to look better large. If it hangs above furniture, aim for around two thirds of the furniture's width. Hang it with the centre at roughly eye level, about 145 cm from the floor.

## Living with it

The best abstract pieces change with the light and with your mood. If you find yourself noticing something new in a painting months later, you chose well.

Every abstract piece in the shop is a single original.
`,
  },
  {
    slug: "original-art-as-a-gift",
    category: "living-with-art",
    title: "Original art as a gift: how to choose a piece for someone else",
    seoTitle: "Original Art as a Gift: How to Choose Well",
    description:
      "How to choose original art as a gift in NZ: reading someone's taste, safe sizes and styles, budgets, and making the gift feel personal.",
    date: "2026-08-24",
    keywords: ["art gift ideas NZ", "original art gift", "unique gifts NZ", "buying art for someone"],
    featured: true,
    shop: { label: "See pieces under $300", href: "/shop?price=under-300" },
    body: `
Original art is one of the most personal gifts you can give, and one of the most lasting. It's also one people worry about getting wrong. A little thought goes a long way.

## Look at what they already live with

The best clue to someone's taste is their home. Notice the colours they choose, whether they like busy or calm rooms, and what's already on their walls. Photos of their place, or a quick look next time you visit, tell you more than any guess.

## Choose a style with a broad appeal

If you're unsure, [landscape](/shop/style/landscape), [coastal](/shop/style/coastal) and [botanical](/shop/style/botanical) works are widely loved and sit easily in most rooms. Soft, quieter [abstract](/shop/style/abstract) pieces work well for people with modern homes.

## Keep the size flexible

Smaller works are the safer choice for a gift. They fit on a shelf, a desk, a bedside or a crowded wall, and nobody feels obliged to rearrange their living room. Pieces that can lean as well as hang give the most freedom.

## Make it personal

Art connected to a shared memory, a favourite place or a season is far more meaningful than a generic choice. A coastal piece for someone who grew up by the sea, or a botanical for a keen gardener, says you were thinking of them.

## Think about timing and delivery

Allow time for tracked courier delivery, especially before birthdays and Christmas. Every piece in the shop is couriered across New Zealand, and you can enter the recipient's address at checkout.

## Include a note

A short card with the title of the work, the artist and why you chose it turns a nice object into a story they'll retell every time someone asks about it.

## A gift that lasts

Flowers fade and gadgets date, but a well-chosen original goes on being enjoyed for decades. That's a lot of value from one thoughtful choice.
`,
  },
];

export const posts: Post[] = [
  ...livingPosts,
  ...posts2017,
  ...posts2018,
  ...posts2019,
  ...posts2020,
  ...posts2021,
  ...posts2022,
  ...posts2023,
  ...posts2024,
  ...posts2025,
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug) ?? null;
export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const featuredPosts = () => sortedPosts().filter((p) => p.featured);
export const postsInCategory = (id: CategoryId) => sortedPosts().filter((p) => p.category === id);
export const postYear = (p: Post) => p.date.slice(0, 4);

/** Posts grouped by year, newest year first. */
export function postsByYear(list: Post[] = sortedPosts()) {
  const years = new Map<string, Post[]>();
  for (const p of list) years.set(postYear(p), [...(years.get(postYear(p)) ?? []), p]);
  return [...years.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

const words = (p: Post) => p.body.split(/\s+/).filter(Boolean).length;
export const wordCount = words;
export const readMinutes = (p: Post) => Math.max(2, Math.round(words(p) / 220));

/** Other posts: same category first, then the most shared keywords. */
export function relatedPosts(post: Post, n = 3) {
  const terms = (p: Post) => new Set(p.keywords.flatMap((k) => k.toLowerCase().split(/\s+/)).filter((w) => w.length > 3));
  const mine = terms(post);
  return sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.category === post.category ? 5 : 0) + [...terms(p)].filter((w) => mine.has(w)).length,
    }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, n)
    .map((x) => x.p);
}
