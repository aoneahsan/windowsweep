/** A changed scan scope or threshold invalidates rows measured under the old one. */
import type { Candidate } from '../lib/cli';

interface OffersSnapshot {
  candidates: Candidate[];
  offeredSections: number[];
  selectedPaths: Set<string>;
}

export function withoutSectionOffers(
  state: OffersSnapshot,
  sections: readonly number[]
): OffersSnapshot {
  const invalid = new Set(sections);
  const oldPaths = new Set(
    state.candidates.filter((row) => invalid.has(row.section)).map((row) => row.path)
  );
  return {
    candidates: state.candidates.filter((row) => !invalid.has(row.section)),
    offeredSections: state.offeredSections.filter((id) => !invalid.has(id)),
    selectedPaths: new Set([...state.selectedPaths].filter((path) => !oldPaths.has(path))),
  };
}
