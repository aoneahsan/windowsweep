/**
 * Which notes are on screen in this launch, for the surfaces that must not stack.
 *
 * Its own small store rather than a slice of `state/store.ts`, as `lib/sync-state.ts` is: three
 * components read it and each writes only its own field - `LegalNotice` the legal bar's phase,
 * `ReleaseGate` whether a release notice or block is up - and `TourControl` reads the phase so a
 * first run's tour hint waits until the bar has closed (D90).
 *
 * 🔴 IN MEMORY ONLY. The legal bar's durable record is `lib/consent.ts`; this is where it stands
 * right now, and every launch starts at `deciding`.
 *
 * 🔴 BOOT-SAFE: zustand is its only runtime import (`NoticePhase` is a type, and erased).
 */

import { create } from 'zustand';

import type { NoticePhase } from '../lib/consent';

interface Notices {
  /** The legal bar's place in this launch. */
  legal: NoticePhase;
  /** A release notice or block is on screen; it takes priority over the legal bar. */
  release: boolean;
  setLegal: (phase: NoticePhase) => void;
  setRelease: (shown: boolean) => void;
}

export const useNotices = create<Notices>()((set) => ({
  legal: 'deciding',
  release: false,
  setLegal: (phase) => {
    set({ legal: phase });
  },
  setRelease: (shown) => {
    set({ release: shown });
  },
}));
