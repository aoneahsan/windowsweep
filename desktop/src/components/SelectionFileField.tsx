/**
 * The selection-file field - `picker.html`'s "Drive this from a file instead", built
 * from the gallery's upload field (`g-forms.js`, "specialised"): the label, the info
 * affordance, the zone and its states.
 *
 * A dropped or chosen file is read HERE, in the webview, and matched against the
 * candidates of the section in view the way the engine matches a `--select-file`
 * (`lib/selection-file.ts`). Matches are ticked; each line that matched nothing is
 * listed in the engine's own words. Nothing leaves the machine - the rows it ticks
 * go wherever a row ticked by hand goes, which is "Remove these".
 *
 * 🔴 THE INFO AFFORDANCE COMES BEFORE THE PICK (UI mandate 2), and its numbers are
 * the enforced ones: `refuseSelectionFile` checks the same ".txt or .list" and
 * "256 KB" the tooltip and the hint print, and a refusal says why AT the control.
 *
 * 🔴 "CHOOSE A FILE" IS THE WEBVIEW'S OWN FILE INPUT (RAC `FileTrigger`), NOT
 * `@tauri-apps/plugin-dialog`'s `open()`. Both open the same native Windows dialog,
 * but `open()` answers with a PATH, and nothing in this window may read an arbitrary
 * path: the webview has no filesystem plugin and no asset protocol, by design
 * (`capabilities/default.json`), and the only Rust readers are confined to a run's
 * own folder. The input hands back the file the person chose, so reading it needs no
 * new permission, no new dependency and no Rust. Drops work the same way because
 * `dragDropEnabled` is off (`tauri.conf.json`), which leaves HTML5 drag and drop to
 * the page.
 */

import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  DropZone,
  FileTrigger,
  Text,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components';

import { formatBytes } from '../lib/format';
import {
  SELECTION_FILE_TYPES,
  matchSelection,
  refuseSelectionFile,
  selectionLines,
} from '../lib/selection-file';
import type { Candidate } from '../lib/cli';

/** How many unmatched lines are listed before the rest collapse into a count. */
const UNMATCHED_SHOWN = 20;

/** What the zone says it last did - the dummy's `idle`, `rejected` and `done`. */
type Verdict =
  | { state: 'idle' }
  | { state: 'rejected'; why: 'type'; name: string }
  | { state: 'rejected'; why: 'size'; bytes: number }
  | { state: 'rejected'; why: 'unreadable' }
  | { state: 'done'; lines: number; matched: number; unmatched: string[] };

export function SelectionFileField({
  candidates,
  onMatch,
}: {
  /** The rows the section in view offers - the only paths a line can match. */
  candidates: readonly Candidate[];
  /** Tick these candidate paths, leaving every other choice as it is. */
  onMatch: (paths: string[]) => void;
}) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>({ state: 'idle' });

  const read = useCallback(
    async (file: File) => {
      const refusal = refuseSelectionFile(file);
      if (refusal) {
        setVerdict(
          refusal.reason === 'type'
            ? { state: 'rejected', why: 'type', name: refusal.name }
            : { state: 'rejected', why: 'size', bytes: refusal.bytes }
        );
        return;
      }
      let text: string;
      try {
        text = await file.text();
      } catch {
        setVerdict({ state: 'rejected', why: 'unreadable' });
        return;
      }
      const found = matchSelection(
        selectionLines(text),
        candidates.map((c) => c.path)
      );
      if (found.paths.length > 0) onMatch(found.paths);
      setVerdict({
        state: 'done',
        lines: found.lines,
        matched: found.matchedLines,
        unmatched: found.unmatched,
      });
    },
    [candidates, onMatch]
  );

  const said = (() => {
    if (dragging) return t('picker.fileDragging');
    switch (verdict.state) {
      case 'idle':
        return t('picker.fileIdle');
      case 'done':
        return t('picker.fileDone', { count: verdict.lines, matched: verdict.matched });
      case 'rejected':
        if (verdict.why === 'type') return t('picker.fileWrongType', { name: verdict.name });
        if (verdict.why === 'size')
          return t('picker.fileTooBig', { size: formatBytes(verdict.bytes) });
        return t('picker.fileUnreadable');
    }
  })();
  const unmatched = verdict.state === 'done' ? verdict.unmatched : [];

  return (
    <div>
      <div className="fw-lbl">
        {t('picker.fileLabel')}
        <TooltipTrigger delay={0} closeDelay={0}>
          <Button
            className="fx-btn"
            style={{ position: 'static' }}
            aria-label={t('picker.fileTipLabel')}
          >
            ?
          </Button>
          <Tooltip className="pop" placement="bottom start" offset={4}>
            <div>
              <Trans i18nKey="picker.fileTipPurpose" components={{ 1: <b /> }} />
            </div>
            <div>
              <Trans i18nKey="picker.fileTipTypes" components={{ 1: <b /> }} />
            </div>
            <div>
              <Trans i18nKey="picker.fileTipSize" components={{ 1: <b /> }} />
            </div>
            <div>
              <Trans i18nKey="picker.fileTipExample" components={{ 1: <b /> }} />
            </div>
          </Tooltip>
        </TooltipTrigger>
      </div>
      {/* 🔴 D-45 (GATE 4 round 8): the zone's hidden drop button took React Aria's own
          default name, "DropZone", from its string table - a component name outside
          this catalogue. Named by the field's own label; the zone's state line is
          appended to it, so it reads "Selection file, Drop a selection file here …". */}
      <DropZone
        aria-label={t('picker.fileLabel')}
        className="drop"
        data-state={dragging ? 'dragging' : verdict.state}
        style={{ marginTop: 'var(--sp-2)' }}
        getDropOperation={() => 'copy'}
        onDropEnter={() => {
          setDragging(true);
        }}
        onDropExit={() => {
          setDragging(false);
        }}
        onDrop={(e) => {
          setDragging(false);
          const item = e.items.find((i) => i.kind === 'file');
          if (item?.kind === 'file') void item.getFile().then(read);
        }}
      >
        {/* The zone's label, and a live region: the verdict is announced where it
            was asked for, which is the dummy's `role="status"` on the same line. */}
        <Text slot="label" elementType="p" className="t-sm" role="status">
          {said}
        </Text>
        <p className="drop-hint">{t('picker.fileHint')}</p>
        <FileTrigger
          acceptedFileTypes={[...SELECTION_FILE_TYPES]}
          onSelect={(files) => {
            const file = files?.[0];
            if (file) void read(file);
          }}
        >
          <Button className="btn">{t('picker.fileChoose')}</Button>
        </FileTrigger>
      </DropZone>
      {unmatched.length === 0 ? null : (
        <div className="note note-warn" style={{ marginTop: 'var(--sp-3)' }}>
          <span aria-hidden="true">⚠</span>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', minWidth: 0 }}
          >
            {unmatched.slice(0, UNMATCHED_SHOWN).map((line) => (
              <div className="t-xs" key={line} style={{ overflowWrap: 'anywhere' }}>
                {t('picker.fileUnmatched', { line })}
              </div>
            ))}
            {unmatched.length > UNMATCHED_SHOWN ? (
              <div className="t-xs ink-3">
                {t('picker.fileMore', { count: unmatched.length - UNMATCHED_SHOWN })}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
