/** The licensed-build verdict lives only for this desktop process. */

import { create } from 'zustand';

interface LicenceState {
  inactive: boolean;
  setInactive: (inactive: boolean) => void;
}

export const useLicenceState = create<LicenceState>()((set) => ({
  inactive: false,
  setInactive: (inactive) => set({ inactive }),
}));
