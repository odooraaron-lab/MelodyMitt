// An abstract landscape in the site's palette, hung on the studio wall of the login page.
// Shapes settle into place on load and the brushstroke draws itself; the sun drifts slowly after that.
export function StudioArtwork() {
  return (
    <svg className="studio-art" viewBox="0 0 400 500" role="img" aria-label="Abstract landscape in ochre, olive and ink">
      <defs>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.14  0 0 0 0.5 0" />
        </filter>
        <clipPath id="paper">
          <rect width="400" height="500" />
        </clipPath>
      </defs>
      <g clipPath="url(#paper)">
        <rect width="400" height="500" fill="#efe6d8" />
        <circle className="art-sun" cx="272" cy="150" r="74" fill="#c8913c" />
        <path className="art-arch" d="M48 420V230a62 62 0 0 1 124 0v190z" fill="#c4877a" />
        <rect className="art-band" x="0" y="318" width="400" height="44" fill="#2e3b4e" />
        <path className="art-hill" d="M0 392c70-40 150-52 230-30s120 18 170-6v144H0z" fill="#6e7046" />
        <circle className="art-moon" cx="118" cy="122" r="16" fill="#f7f2ea" />
        <path
          className="art-stroke"
          d="M36 468c48-26 96-30 140-12s88 20 130-6 52-34 68-30"
          fill="none"
          stroke="#2b2724"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength={1}
        />
        <rect width="400" height="500" filter="url(#grain)" opacity="0.14" />
      </g>
    </svg>
  );
}
