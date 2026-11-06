/**
 * The hero's sweep (moved out of `screens/Home.tsx` at the 500-line ceiling; no change to it).
 */

/** The product's one visual metaphor, at the hero only - decoration belongs here,
    not on every card. Copied from the dummy's markup. */
export function HeroSweep() {
  return (
    <svg className="hero-sweep" viewBox="0 0 480 220" fill="none" aria-hidden="true">
      <path
        d="M-20 176 C 110 176, 120 40, 246 40 S 372 148, 500 62"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d="M-20 214 C 118 214, 128 96, 262 96 S 392 190, 500 118"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M-20 240 C 126 240, 136 148, 278 148 S 408 226, 500 168"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity=".3"
      />
    </svg>
  );
}
