/** Stable, content-approved landmarks. Missing or hidden targets are omitted at run time. */
export const PAGE_TOURS = {
  '/': ['home-scan', 'home-dry-run', 'home-safety'],
  '/sections': ['sections-filter', 'sections-table', 'sections-selection'],
  '/picker': ['choose-filter', 'choose-table', 'choose-consequence'],
  '/run': ['run-prepared', 'run-start', 'run-log'],
  '/history': ['history-filter', 'history-table', 'history-total'],
  '/report': ['report-summary', 'report-sections', 'report-export'],
  '/account': ['account-sign-in', 'account-stored', 'account-delete'],
  '/settings': ['settings-tabs', 'settings-thresholds', 'settings-privacy', 'settings-version'],
  '/plans': ['plans-allowance', 'plans-options', 'plans-referrals'],
} as const;

export type TourRoute = keyof typeof PAGE_TOURS;

export function isTourRoute(path: string): path is TourRoute {
  return Object.prototype.hasOwnProperty.call(PAGE_TOURS, path);
}

export function visibleSteps(path: TourRoute): { id: string; target: HTMLElement }[] {
  return PAGE_TOURS[path].flatMap((id) => {
    const target = document.querySelector<HTMLElement>(`[data-tour="${id}"]`);
    if (!target || target.getClientRects().length === 0) return [];
    for (let node: HTMLElement | null = target; node; node = node.parentElement) {
      if (node.hidden) return [];
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return [];
    }
    return [{ id, target }];
  });
}
