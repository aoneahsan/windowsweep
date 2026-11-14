/**
 * The Picker's four data cells, section by section - `picker-columns.js` (1.5.0), where every word a
 * cell can show lives in one place so the app mirrors one place.
 *
 * One table, five columns; what the last four hold depends on the section in view. 17, 18 and 23
 * keep Path / Project / Idle / Size and 19 keeps Reason and Age. 1.5.0 adds three shapes:
 * - 26 is ONE list of three kinds - desktop program, Store app, broken entry (D109) - led by the
 *   program's name, with Ran in place of Idle;
 * - 27 names five kinds and, under every path, what happens to that row (A4-07);
 * - 30-32 are the INSTALL mode (D110): a row installs or removes; the third column is the
 *   needs-admin tag and the fourth what the fetching tool will download - never space reclaimed.
 *   No row runs a PC maker's tool (A4-15): the engine names it in its log and never starts it.
 *
 * 🔴 A secondary line on a name-first row (26, 32) YIELDS to its cell instead of widening it
 * (`FIT`), so Kind, Ran and Size stay in view at the 760 px minimum. Path-first rows keep the
 * 38rem clip and the table's own sideways scroll, as 1.4.0 left them.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes, formatDay } from '../lib/format';
import type { Candidate } from '../lib/cli';
import {
  displayPath,
  downloadOf,
  installVerb,
  leftoverKind,
  programKind,
  ranDays,
  type InstallVerb,
} from '../lib/candidate-extras';

/** The header keys each section names (`picker-columns.js` HEAD). */
const HEAD: Record<number, readonly [string, string, string, string]> = {
  19: ['picker.colPath', 'picker.colReason', 'picker.colAge', 'picker.colSize'],
  26: ['picker.colProgram', 'picker.colKind', 'picker.colRan', 'picker.colSize'],
  27: ['picker.colPath', 'picker.colKind', 'picker.colIdle', 'picker.colSize'],
  30: ['picker.colUpdate', 'picker.colCategory', 'picker.colNeeds', 'picker.colDownload'],
  31: ['picker.colDriver', 'picker.colAction', 'picker.colNeeds', 'picker.colDownload'],
  32: ['picker.colApp', 'picker.colVersion', 'picker.colNeeds', 'picker.colDownload'],
};
const PLAIN = ['picker.colPath', 'picker.colProject', 'picker.colIdle', 'picker.colSize'] as const;

/** The four column headings for a section, as catalogue keys. */
export function columnKeys(section: number): readonly [string, string, string, string] {
  return HEAD[section] ?? PLAIN;
}

/** The 38rem clip a path-first row keeps (1.4.0). */
const CLIP: React.CSSProperties = {
  maxWidth: '38rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
/** A secondary line that yields to its cell (`picker-columns.js` `fit`). */
const FIT: React.CSSProperties = {
  width: 0,
  minWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
const SUB: React.CSSProperties = { marginTop: 'var(--sp-1)' };

function Sub({ text, mono = false, fit = false }: { text: string; mono?: boolean; fit?: boolean }) {
  return (
    <p
      className={mono ? 'mono t-xs ink-3' : 't-xs ink-3'}
      title={fit ? text : undefined}
      style={fit ? { ...SUB, ...FIT } : SUB}
    >
      {text}
    </p>
  );
}

/** The switch's accessible name: the verb in install mode, the program in 26, the path elsewhere. */
export function useChoiceLabel(): (row: Candidate, install: boolean) => string {
  const { t } = useTranslation();
  return (row, install) => {
    const name = row.label ?? row.path;
    if (install) {
      return installVerb(row) === 'remove'
        ? t('picker.chooseRemove', { name })
        : t('picker.chooseInstall', { name });
    }
    return t('picker.chooseRow', { path: row.section === 26 ? name : displayPath(row) });
  };
}

const VERB_SOURCE: Record<InstallVerb, string> = {
  install: 'picker.source31.install',
  remove: 'picker.source31.remove',
};

/** The name-first cell of 26 and of every install row. */
function NameFirst({ row, install }: { row: Candidate; install: boolean }) {
  const { t } = useTranslation();
  const verb = installVerb(row);
  return (
    <td>
      <div className="t-sm">
        {row.label ?? row.path}
        {row.running ? (
          <>
            {' '}
            <span className="badge badge-warn">{t('picker.running')}</span>
          </>
        ) : null}
      </div>
      {row.section === 26 ? <Sub text={row.path} mono fit /> : null}
      {install && row.section === 31 && verb === 'install' && row.driver_class ? (
        <Sub text={row.driver_class} />
      ) : null}
      {install && verb === 'remove' ? (
        <Sub
          text={t('picker.oldPackageDetail', {
            inf: row.path.replace(/^oem:/, ''),
            date: row.date ? formatDay(row.date) : '—',
            size: formatBytes(row.bytes),
          })}
        />
      ) : null}
      {install && row.section === 32 ? (
        <Sub text={[row.id ?? row.path, row.source].filter(Boolean).join(' · ')} fit />
      ) : null}
      {/* Never truncated: it is what the person has to do. */}
      {row.running ? <Sub text={t('picker.runningHint')} /> : null}
      {row.section === 26 && programKind(row) === 'broken' && row.uninstaller ? (
        <Sub text={t('picker.brokenMissing', { path: row.uninstaller })} />
      ) : null}
    </td>
  );
}

/** What happens to a 27 row, said under its path before it is chosen (A4-07). */
function Fate({ row }: { row: Candidate }) {
  const { t } = useTranslation();
  const kind = leftoverKind(row);
  if (kind === 'folder' || kind === 'shortcut') return <Sub text={t('picker.fate27.recycle')} />;
  if (kind === 'registry') return <Sub text={t('picker.fate27.registry')} />;
  if (kind === 'task') return <Sub text={t('picker.fate27.task')} />;
  if (kind === 'startup' && row.target) {
    return <Sub text={t('picker.fate27.startup', { target: row.target })} />;
  }
  return null;
}

/** The first data cell: the name or the path, with what the row is underneath. */
export function NameCell({ row, install }: { row: Candidate; install: boolean }) {
  const { t } = useTranslation();
  if (install || row.section === 26) return <NameFirst row={row} install={install} />;
  return (
    <td>
      {/* The engine reports absolute paths, often past 80 characters, so the cell ellipsises
          as the dummy's does and the whole path is one hover away - and always in the switch's
          accessible name. */}
      <div className="mono t-sm" title={displayPath(row)} style={CLIP}>
        {displayPath(row)}
      </div>
      {row.section === 19 ? (
        <p className="t-xs ink-3" style={SUB}>
          {t('picker.fileBasis', {
            root: row.root ?? '',
            days: row.idle_days ?? 0,
            basis: t(
              row.age_basis === 'write+access' ? 'picker.basisWriteAccess' : 'picker.basisWrite'
            ),
          })}
          {row.skip_reason ? ` · ${row.skip_reason}` : ''}
        </p>
      ) : null}
      {row.section === 27 ? <Fate row={row} /> : null}
    </td>
  );
}

const KIND_26 = {
  desktop: 'picker.kind26.desktop',
  store: 'picker.kind26.store',
  broken: 'picker.kind26.broken',
} as const;
const KIND_27 = {
  folder: 'picker.kind27.folder',
  shortcut: 'picker.kind27.shortcut',
  registry: 'picker.kind27.registry',
  startup: 'picker.kind27.startup',
  task: 'picker.kind27.task',
} as const;
const VERB_KEY = {
  install: 'picker.verb.install',
  remove: 'picker.verb.remove',
} as const;

/** The second data cell: Project, Reason, Kind, Category, Action or Version. */
export function KindCell({ row, install }: { row: Candidate; install: boolean }) {
  const { t } = useTranslation();
  if (row.section === 19)
    return <td className="t-sm ink-3">{t(`picker.reason.${row.reason ?? 'old'}`)}</td>;
  if (row.section === 26) {
    const kind = programKind(row);
    return (
      <td className="t-sm ink-3">
        {kind ? (
          <span className={`badge ${kind === 'broken' ? 'badge-warn' : 'badge-neutral'}`}>
            {t(KIND_26[kind])}
          </span>
        ) : (
          '—'
        )}
      </td>
    );
  }
  if (row.section === 27) {
    const kind = leftoverKind(row);
    return (
      <td className="t-sm ink-3">
        {kind ? <span className="badge badge-neutral">{t(KIND_27[kind])}</span> : '—'}
      </td>
    );
  }
  if (install && row.section === 31) {
    const verb = installVerb(row);
    return (
      <td className="t-sm ink-3">
        <span className={`badge ${verb === 'remove' ? 'badge-warn' : 'badge-neutral'}`}>
          {t(VERB_KEY[verb])}
        </span>
        <Sub text={t(VERB_SOURCE[verb])} />
      </td>
    );
  }
  if (install && row.section === 32) {
    return (
      <td className="t-sm ink-3" style={{ whiteSpace: 'nowrap' }}>
        {t('picker.versionChange', { from: row.version ?? '—', to: row.available ?? '—' })}
      </td>
    );
  }
  if (install) return <td className="t-sm ink-3">{row.category ?? '—'}</td>;
  /* The engine sends an empty string, not null, for a row with no project - section 23's
     folders - so both read as the dummy's dash. */
  return <td className="t-sm ink-3">{row.label || row.project || '—'}</td>;
}

/** The third data cell: Needs in install mode, Ran in 26, Idle or Age elsewhere. */
export function WhenCell({ row, install }: { row: Candidate; install: boolean }) {
  const { t } = useTranslation();
  if (install) {
    return (
      <td className="t-sm ink-3">
        {row.needs_admin ? <span className="badge badge-danger">{t('sections.admin')}</span> : '—'}
      </td>
    );
  }
  const days = row.section === 26 ? ranDays(row) : row.idle_days;
  return (
    <td className="num t-sm ink-3">
      {days === null ? '—' : t('picker.idleShort', { count: days })}
    </td>
  );
}

/** The last data cell: the download in install mode, the space a row frees elsewhere. */
export function SizeCell({ row, install }: { row: Candidate; install: boolean }) {
  const { t } = useTranslation();
  if (install) {
    if (installVerb(row) === 'remove') return <td className="num-cell t-sm ink-2">—</td>;
    const size = downloadOf(row);
    return size === null ? (
      <td className="num-cell t-xs ink-3">{t('picker.sizeUnknown')}</td>
    ) : (
      <td className="num-cell t-sm ink-2">{formatBytes(size)}</td>
    );
  }
  if (row.bytes <= 0) return <td className="num-cell t-sm ink-3">—</td>;
  return <td className="num-cell t-sm accent-ink">{formatBytes(row.bytes)}</td>;
}
