// Journal posts. To add one, copy an entry, give it a new slug and date, and write the body.
// Body format: blank line between paragraphs, "## " for headings, "- " for list items,
// **bold**, *italic*, and [link text](/shop).

export type Post = {
  slug: string;
  title: string; // shown on the page
  seoTitle: string; // Google title, under ~60 characters
  description: string; // Google description, under ~155 characters
  date: string; // YYYY-MM-DD
  keywords: string[];
  body: string;
};

export const posts: Post[] = [
  {
    slug: "how-to-choose-original-art-for-your-living-room",
    title: "How to choose original art for your living room",
    seoTitle: "How to Choose Original Art for Your Living Room",
    description:
      "A practical guide to choosing original art for a living room: size, colour, placement and how to trust your own eye when buying art in NZ.",
    date: "2026-10-01",
    keywords: ["art for living room", "choosing art NZ", "original art for home", "interior design art"],
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
    title: "How high to hang art: a simple guide that works in any room",
    seoTitle: "How High to Hang Art: A Simple Guide for Any Room",
    description:
      "The gallery rule for hanging art at the right height, plus how to hang above a sofa, bed or sideboard. Easy steps for NZ homes.",
    date: "2026-09-24",
    keywords: ["how high to hang art", "hanging art above sofa", "picture hanging guide", "art placement"],
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
    title: "Original art or a print? Why one-of-a-kind pieces are worth it",
    seoTitle: "Original Art vs Prints: Why One-of-a-Kind Is Worth It",
    description:
      "What you actually get when you buy original art instead of a print, and how to start a collection of original work in New Zealand.",
    date: "2026-09-16",
    keywords: ["original art vs prints", "buy original art NZ", "why buy original art", "art collecting NZ"],
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
    title: "Gallery wall ideas: how to make it feel collected, not cluttered",
    seoTitle: "Gallery Wall Ideas: Collected, Not Cluttered",
    description:
      "How to plan a gallery wall that feels considered: choosing pieces, spacing, layout styles and mixing original art with objects.",
    date: "2026-09-07",
    keywords: ["gallery wall ideas", "gallery wall layout", "art wall NZ", "styling art at home"],
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
    title: "Warm neutral interiors: how art adds depth to a calm room",
    seoTitle: "Warm Neutral Interiors: How Art Adds Depth",
    description:
      "Beige, oatmeal and stone interiors are calm but can fall flat. Here's how original art and objects bring depth, texture and warmth.",
    date: "2026-08-28",
    keywords: ["neutral interior design", "beige interior", "warm neutral living room", "art for neutral rooms"],
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
    title: "How to care for original artwork in a New Zealand home",
    seoTitle: "How to Care for Original Art in a New Zealand Home",
    description:
      "Simple ways to protect original art from sun, damp and condensation in NZ homes, plus where not to hang it and how to clean it.",
    date: "2026-08-19",
    keywords: ["caring for artwork", "protect art from sun", "art care NZ", "damp and condensation art"],
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
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug) ?? null;
export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
