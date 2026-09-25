/**
 * Ask the engine what ONE interactive section offers: a dry-run of that section.
 *
 * Two controls ask, and they must ask the same way - Home's "Choose items" on a
 * card nothing has asked yet, and the Picker's own "Dry-run" in the state
 * `picker.html?empty=1` draws. A dry-run runs the section's finder, lists what it
 * would offer and deletes nothing: every deletion helper short-circuits under
 * `--dry-run` (IRON rule 3). `finishRun` folds the answer into the store through
 * `lib/offers.ts`, so a caller only reads the verdict back.
 *
 * 🔴 The same builder the Sections screen's Dry-run uses, so the ask carries the
 * thresholds and the exclusions every other run carries - a list offered under
 * different ones would not be the list "Remove these" acts on.
 *
 * 🔴 The answer arrives seconds later. A caller that has unmounted by then - the
 * person moved to another screen - gets `null` and must not navigate on a run they
 * stopped watching. The run is recorded either way.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { safeBatchArgs } from '../lib/engine';
import { useRunPreferences } from './derived';
import { useStore } from './store';
import { useEngineRun } from './use-engine-run';

export interface AskSection {
  /** The section whose dry-run is in flight - its control carries the pending state. */
  asking: number | null;
  /**
   * Resolves `true` when the engine searched the section, `false` when it did not
   * (skipped with developer mode off, or failed - the Run screen's log says why),
   * and `null` when the caller unmounted before the answer.
   */
  ask: (section: number) => Promise<boolean | null>;
}

export function useAskSection(): AskSection {
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const runEngine = useEngineRun();
  const [asking, setAsking] = useState<number | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const ask = useCallback(
    async (section: number) => {
      setAsking(section);
      try {
        await runEngine(
          safeBatchArgs({ dryRun: true, sections: [section], ...prefs, excludedPaths })
        );
      } finally {
        setAsking(null);
      }
      if (!mountedRef.current) return null;
      /* Read back from the one place that decides it (`lib/offers.ts`), so "did the
         engine search this section" has a single answer. */
      return useStore.getState().offeredSections.includes(section);
    },
    [runEngine, prefs, excludedPaths]
  );

  return { asking, ask };
}
