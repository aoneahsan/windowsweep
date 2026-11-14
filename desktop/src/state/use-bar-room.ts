/**
 * Room under a page's last block for a fixed selection bar, as tall as the bar while it shows
 * (1.5.0, AMENDMENTS-4 A4-12, `page-picker.js` `fitRoom`).
 *
 * 🔴 A fixed spacer let the bar cover the page: an install-mode bar wraps to five lines at 760 px
 * and hid the note under the table by 88 px, and section 17's ordinary bar already hid it by 28 px.
 * The bar's height also moves with the text-size and density axes and with the width, so it is
 * MEASURED - a ResizeObserver reports each change as it happens; nothing re-reads on a timer.
 */

import { useCallback, useState } from 'react';

export function useBarRoom(shown: boolean): {
  /** Attach to the bar. */
  ref: (node: HTMLDivElement | null) => (() => void) | undefined;
  /** The room's height, for the spacer after the page's last block. */
  room: string;
} {
  const [height, setHeight] = useState(0);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return undefined;
    const observer = new ResizeObserver(() => {
      setHeight(node.offsetHeight);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);
  return { ref, room: shown ? `calc(${String(height)}px + var(--sp-4))` : 'var(--sp-16)' };
}
