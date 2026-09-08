/**
 * The drives, and how much of each one a run could give back.
 *
 * 🔴 THE DECLARATION THIS REPLACES SAID THE FIGURE DID NOT EXIST, and half of that
 * was right. `pending.drives` read: "A run reports what it reclaimed, and nothing
 * about your drives or how much room is left on them, so this window has no
 * measured figure to draw." The engine's `--json` summary still carries no drive
 * and no free-space field - that part has not changed - so the answer came from
 * Windows instead, through `list_drives` (`src-tauri/src/drives.rs`), which asks
 * `kernel32` directly rather than paying a PowerShell start-up at the top of a
 * screen.
 *
 * 🔴 THE RECLAIMABLE SLICE IS ATTRIBUTED, NOT APPORTIONED. The click dummy spreads
 * one total across its drives by a seeded share (`db.js` -> `drives()`), which is
 * the right thing for a prototype and would be an invented number here. Every
 * scanned target carries the absolute path the engine printed, and a path names
 * the volume it is on - so each target's bytes are added to ITS OWN drive and
 * nothing is spread. A target whose drive is not in the list (a removable disk, a
 * network share, a letter that went away between the scan and now) is counted in
 * no drive at all rather than being pushed onto the nearest one.
 */

import { useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { devEngine } from './dev-gate';
import type { ScanTarget } from './cli';

/** One fixed drive, as `src-tauri/src/drives.rs` -> `DriveInfo` sends it. */
export interface DriveInfo {
  /** A single letter, no colon and no slash: `"C"`. The window adds the colon. */
  letter: string;
  /** The volume label, or empty. Empty rather than null, so there is one thing to render. */
  label: string;
  total_bytes: number;
  free_bytes: number;
}

/**
 * A drive with this machine's own measurement attached.
 *
 * 🔴 NO `label`. The Rust command sends one and nothing here carries it forward,
 * deliberately: `consent.neverSent` promises that a drive label never leaves this
 * machine, and Sentry's DOM integration serialises a clicked element's attributes
 * into a breadcrumb. A label held in app state is a label that can reach a
 * `title`, an `aria-label` or a rendered string by accident later. The dummy draws
 * the letter and never the label, so dropping it here costs the UI nothing and
 * removes the surface entirely.
 */
export interface DriveRow {
  letter: string;
  totalBytes: number;
  freeBytes: number;
  /**
   * What the last scan found on THIS drive, or `null` when nothing has been
   * measured.
   *
   * 🔴 `null`, never `0`. Zero means "measured, and there is nothing here", which
   * is a real and different state - a person who excluded everything on D: should
   * see that, not the same blank as someone who has never scanned.
   */
  reclaimableBytes: number | null;
}

/**
 * Every fixed drive on this machine.
 *
 * Outside a Tauri window there is no `invoke`, so the development stand-in answers
 * and the parity capture can see this band at all. In production the branch does
 * not exist - see `dev-gate.ts`.
 */
export async function listDrives(): Promise<DriveInfo[]> {
  const dev = await devEngine();
  if (dev) return dev.devDrives();
  return invoke<DriveInfo[]>('list_drives');
}

/**
 * The drive letter a path sits on, upper-cased, or null when the path does not
 * name one.
 *
 * 🔴 Deliberately narrow: `C:\...` and nothing else. A UNC path (`\\server\share`)
 * names no local volume and must return null rather than being coerced into a
 * letter - counting a colleague's share against this machine's C: would overstate
 * what a run can give back, which is the one direction this figure must never err
 * in. The engine resolves every target path with `Get-FullPath` before printing
 * it, so there is no relative case to handle.
 */
export function driveLetterOf(path: string): string | null {
  if (path.length < 2 || path[1] !== ':') return null;
  const letter = path[0]?.toUpperCase() ?? '';
  return letter >= 'A' && letter <= 'Z' ? letter : null;
}

/**
 * The rows the Drives band draws: what Windows reports, plus what the last scan
 * found on each volume.
 *
 * `measured` is `scannedAt !== null`, the same separate fact every other figure on
 * Home reads. It is NOT "the list is non-empty": a person who excluded everything
 * hands in an empty array after a real measurement, and reading that as "nothing
 * measured" would blank a band that has a true answer of zero.
 */
export function driveRows(
  drives: DriveInfo[],
  scanTargets: ScanTarget[],
  measured: boolean,
): DriveRow[] {
  const byLetter = new Map<string, number>();
  if (measured) {
    for (const target of scanTargets) {
      if (target.bytes <= 0) continue;
      const letter = driveLetterOf(target.path);
      if (letter === null) continue;
      byLetter.set(letter, (byLetter.get(letter) ?? 0) + target.bytes);
    }
  }

  return drives.map((drive) => ({
    letter: drive.letter,
    totalBytes: drive.total_bytes,
    freeBytes: drive.free_bytes,
    /* A measured drive with no targets on it is 0, not null - the scan looked and
       found nothing there. Only an unmeasured machine is null. */
    reclaimableBytes: measured ? (byLetter.get(drive.letter.toUpperCase()) ?? 0) : null,
  }));
}

/**
 * The three widths of one rail, as percentages of the whole disk.
 *
 * 🔴 The reclaimable slice comes OUT of the used slice rather than being added
 * beside it, which is what the dummy does (`wire.js` -> `renderDrives`:
 * `(d.used - d.reclaimable) / d.total`). The space is already occupied; the rail
 * shows which part of what is occupied could be given back. Drawing it as a fourth
 * region past 100% would say the disk holds more than it does.
 *
 * 🔴 Clamped, because the two numbers come from different instants: Windows
 * reports free space now and the scan measured sizes a few minutes ago, so a large
 * download finishing in between can make the reclaimable slice exceed what is
 * used. Clamping keeps the rail a rail; the figures beside it are printed
 * unclamped, so the reader sees the real numbers either way.
 */
export function railWidths(row: DriveRow): { usedPct: number; reclaimablePct: number } {
  if (row.totalBytes <= 0) return { usedPct: 0, reclaimablePct: 0 };
  const used = Math.max(0, row.totalBytes - row.freeBytes);
  const reclaimable = Math.min(Math.max(0, row.reclaimableBytes ?? 0), used);
  return {
    usedPct: ((used - reclaimable) / row.totalBytes) * 100,
    reclaimablePct: (reclaimable / row.totalBytes) * 100,
  };
}

/** Every drive's capacity added up - the ring's denominator. */
export function totalBytesOf(rows: DriveRow[]): number {
  return rows.reduce((sum, row) => sum + row.totalBytes, 0);
}

/**
 * The Drives band's rows, loaded once and re-derived whenever the scan moves.
 *
 * 🔴 A HOOK RATHER THAN TWO FETCHES. Home draws these figures in two places - the
 * rails in zone 4 and the capacity ring in the hero - and two independent loads
 * would let the ring and the band disagree about the same disk for a frame, which
 * is the shape of every "one figure, several consumers" defect this file's
 * siblings already record.
 *
 * The list itself is read ONCE per mount. Drive letters and capacities do not
 * change while a window is open in any way this product needs to follow, and
 * polling `kernel32` behind a screen would be work nobody asked for. What does
 * change is the measurement, and that is a pure re-derivation.
 *
 * `loading` is the pending state, not "empty": a machine with no fixed drive and a
 * machine that has not answered yet are different, and the band says different
 * things about them.
 */
export function useDriveRows(
  scanTargets: ScanTarget[],
  measured: boolean,
): { rows: DriveRow[]; loading: boolean } {
  const [drives, setDrives] = useState<DriveInfo[] | null>(null);

  useEffect(() => {
    let live = true;
    listDrives()
      .then((list) => { if (live) setDrives(list); })
      /* A drive list that cannot be read is an empty band, never a thrown error
         that takes the screen down. The rest of Home does not depend on it. */
      .catch(() => { if (live) setDrives([]); });
    return () => { live = false; };
  }, []);

  const rows = useMemo(
    () => (drives === null ? [] : driveRows(drives, scanTargets, measured)),
    [drives, scanTargets, measured],
  );
  return { rows, loading: drives === null };
}
