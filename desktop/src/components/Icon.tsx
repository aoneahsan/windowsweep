/**
 * The icon set, transcribed from the approved click dummy so the app draws the
 * same marks. One stroke width, one viewBox, `currentColor` throughout - an icon
 * that hard-codes a colour is an icon the theme control cannot reach.
 */

export const ICONS = {
  home: 'M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-4v-4H8v4H4a1 1 0 0 1-1-1z',
  list: 'M6 5h11M6 10h11M6 15h11M3 5h.01M3 10h.01M3 15h.01',
  play: 'M6 4l10 6-10 6z',
  clock: 'M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3zm0 3.4V10l2.6 1.6',
  doc: 'M5 3h6l4 4v10H5zM11 3v4h4',
  user: 'M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 17c0-3 2.7-4.6 6-4.6s6 1.6 6 4.6',
  gear: 'M10 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM10 2.6v1.8M10 15.6v1.8M17.4 10h-1.8M4.4 10H2.6M15.2 4.8l-1.3 1.3M6.1 13.9l-1.3 1.3M15.2 15.2l-1.3-1.3M6.1 6.1 4.8 4.8',
  sun: 'M10 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM10 1.8v1.6M10 16.6v1.6M18.2 10h-1.6M3.4 10H1.8M15.8 4.2l-1.1 1.1M5.3 14.7l-1.1 1.1M15.8 15.8l-1.1-1.1M5.3 5.3 4.2 4.2',
  close: 'M5 5l10 10M15 5 5 15',
  min: 'M4 10h12',
  max: 'M5 5h10v10H5z',
  menu: 'M3 6h14M3 10h14M3 14h14',
  backend: 'M3 5h14v4H3zM3 11h14v4H3zM6 7h.01M6 13h.01',
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...(size ? { style: { width: size, height: size } } : {})}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
