import type { Post } from "@/content/types";

/**
 * A tiny generated picture for a journal post. It is drawn from the post's slug, so every post gets its own
 * and it never changes, and the colours and shapes hint at the place it is about. Pure SVG: no image files.
 */

type Palette = { bg: string; a: string; b: string; c: string };

const palettes: Record<Post["category"], Palette> = {
  whangarei: { bg: "#e6dccb", a: "#24323f", b: "#c8913c", c: "#b5654a" },
  auckland: { bg: "#dfe3e6", a: "#24323f", b: "#c0674a", c: "#d8ccb9" },
  queenstown: { bg: "#e3e8ec", a: "#4a6073", b: "#c8913c", c: "#f4f1ea" },
  christchurch: { bg: "#e8e0d2", a: "#a4513d", b: "#7d8260", c: "#2e3b4e" },
  hamilton: { bg: "#e3e6d6", a: "#6e7a4c", b: "#aab3b5", c: "#2e3b4e" },
  "new-plymouth": { bg: "#e6e0d8", a: "#2a2826", b: "#c0392b", c: "#f4f1ea" },
  tauranga: { bg: "#e8e0cf", a: "#b8322a", b: "#3f6f86", c: "#dcc79a" },
  "art-history": { bg: "#ebe3d3", a: "#2e3b4e", b: "#c8913c", c: "#b9ae9a" },
  "living-with-art": { bg: "#eadfce", a: "#c8913c", b: "#7d8260", c: "#2e3b4e" },
};

function random(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const arch = (x: number, y: number, w: number, h: number, fill: string) => (
  <path d={`M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}Z`} fill={fill} />
);
const tri = (x: number, y: number, w: number, h: number, fill: string) => (
  <path d={`M${x} ${y + h}L${x + w / 2} ${y}L${x + w} ${y + h}Z`} fill={fill} />
);
const wave = (y: number, amp: number, stroke: string) => (
  <path d={`M-2 ${y}q6 ${-amp} 12 0t12 0t12 0t12 0t12 0`} stroke={stroke} strokeWidth="2.4" fill="none" />
);

export function PostThumb({ post, size = 36 }: { post: Pick<Post, "slug" | "category">; size?: number }) {
  const p = palettes[post.category] ?? palettes["living-with-art"];
  const r = random(post.slug);
  const j = (n: number) => Math.round(r() * n); // small variation
  let art: React.ReactNode;

  switch (post.category) {
    case "whangarei":
      art = (
        <>
          {arch(9 + j(8), 12, 17, 36, p.a)}
          <circle cx={35 + j(4)} cy={14 + j(8)} r="6" fill={p.b} />
          <rect y="39" width="48" height="9" fill={p.c} />
        </>
      );
      break;
    case "auckland":
      art = (
        <>
          <rect x="6" y={16 + j(6)} width="9" height="32" fill={p.a} />
          <rect x="18" y={8 + j(6)} width="9" height="40" fill={p.c} />
          <rect x="30" y={20 + j(6)} width="11" height="28" fill={p.a} />
          <circle cx={36 + j(4)} cy="10" r="4.5" fill={p.b} />
        </>
      );
      break;
    case "queenstown":
      art = (
        <>
          {tri(2 + j(4), 8 + j(4), 32, 32, p.a)}
          {tri(22 + j(4), 18 + j(4), 24, 24, p.c)}
          <rect y="38" width="48" height="10" fill={p.b} />
        </>
      );
      break;
    case "christchurch":
      art = (
        <>
          {arch(12 + j(4), 8, 24, 40, p.a)}
          {arch(19 + j(4), 20, 10, 28, p.bg)}
          <rect x="3" y="30" width="6" height="18" fill={p.b} />
          <rect x="39" y="26" width="6" height="22" fill={p.c} />
        </>
      );
      break;
    case "hamilton":
      art = (
        <>
          <path d={`M-2 ${12 + j(6)}C14 ${2 + j(6)} 26 ${30 + j(6)} 50 ${22 + j(6)}`} stroke={p.b} strokeWidth="9" fill="none" />
          <ellipse cx={14 + j(6)} cy="36" rx="7" ry="11" fill={p.a} transform="rotate(25 20 36)" />
        </>
      );
      break;
    case "new-plymouth":
      art = (
        <>
          {tri(6, 12, 36, 34, p.a)}
          {tri(18.5, 12, 11, 10, p.c)}
          <path d={`M${38 + j(3)} 46q-3 -14 3 -32`} stroke={p.b} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      );
      break;
    case "tauranga":
      art = (
        <>
          <circle cx={14 + j(18)} cy="14" r="7" fill={p.a} />
          {wave(30, 5, p.b)}
          {wave(37, 5, p.b)}
          <rect y="42" width="48" height="6" fill={p.c} />
        </>
      );
      break;
    case "art-history":
      art = (
        <>
          {arch(11, 10, 26, 38, p.c)}
          <rect x="9" y="6" width="30" height="4" fill={p.a} />
          <rect x={12 + j(2)} y="12" width="5" height="32" fill={p.a} />
          <rect x={31 - j(2)} y="12" width="5" height="32" fill={p.a} />
          <circle cx="24" cy="26" r="4" fill={p.b} />
        </>
      );
      break;
    default:
      art = (
        <>
          <rect x="7" y="7" width="34" height="34" fill="none" stroke={p.c} strokeWidth="2.4" />
          <rect x={13 + j(4)} y={14 + j(3)} width="14" height="18" fill={p.a} />
          <circle cx={32 + j(2)} cy={32 + j(2)} r="4.5" fill={p.b} />
        </>
      );
  }

  return (
    <svg className="post-thumb" viewBox="0 0 48 48" width={size} height={size} role="presentation" aria-hidden="true" focusable="false">
      <rect width="48" height="48" fill={p.bg} />
      {art}
    </svg>
  );
}
