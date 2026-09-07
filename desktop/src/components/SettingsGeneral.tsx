/**
 * Settings -> General. Every control here maps to a flag the engine already has,
 * which is what the screen's own lede promises.
 *
 * Translated from `page-settings.js` -> `general()`: developer mode, then the idle
 * window, the temporary-files window, the large-file threshold and the weekly
 * schedule, each with the dummy's own title, description and "Maps to ..."
 * consequence line.
 *
 * 🔴 THE IDLE WINDOW IS ONE FIELD WITH TWO READERS. Home's slider and the number
 * here both set `idleDays` in the one store - never a copy each. Two editable
 * copies of the same number is how a window ends up showing 100 beside a run that
 * used 30, and the whole reason `--days` is passed on every invocation is to stop
 * exactly that.
 *
 * 🔴 THE FLAG IS `--large-file-mb`, NOT `--large-mb`. The dummy's consequence line
 * says the shorter one and it is not a flag: `windowsweep.ps1:171` reads
 * `--large-file-mb` and nothing in the engine answers to `--large-mb`. Shipping the
 * dummy's spelling verbatim would have compiled, passed every gate, and then
 * thrown `unknown argument: --large-mb` from the engine's own default arm the first
 * time someone changed the size. The sentence shape is the dummy's; the flag name
 * is a fact the product owns. Reported for the dummy to be corrected.
 *
 * 🔴 The dummy also says "section 18" where the engine says section 19
 * (`windowsweep.ps1:83`, `docs/cli-reference.md:53`), and offers 500 MB where the
 * engine's default is 100 (`lib/config.ps1`). Both are the same class and both are
 * reported; the app states the engine's numbers, because a settings screen whose
 * figure is not the figure that runs is worse than one that differs from a
 * prototype.
 *
 * 🔴 THE TEN APPEARANCE AXES ARE NOT HERE, and the dummy is explicit about why:
 * "The theme axes are NOT duplicated here: they live in the one theme control,
 * reachable from the title bar on every screen." Mandate 11 asks for one control
 * and one panel; `ThemePanel.tsx` is it. The dummy renders no pointer sentence in
 * their place either, so none is invented here - the gap is reported instead.
 */

import { useTranslation } from 'react-i18next';

import {
  useStore,
  MIN_IDLE_DAYS, MAX_IDLE_DAYS,
  MIN_TEMP_DAYS, MAX_TEMP_DAYS,
  MIN_LARGE_FILE_MB, MAX_LARGE_FILE_MB,
} from '../state/store';

/** The dummy's `row()` - text on the left, one control on the right. */
function SettingRow({
  title,
  description,
  consequence,
  control,
}: {
  title: string;
  description: string;
  consequence?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="set-row">
      <div className="set-txt">
        <h3>{title}</h3>
        <p>{description}</p>
        {consequence !== undefined ? <p className="set-conseq">{consequence}</p> : null}
      </div>
      <div className="set-ctl">{control}</div>
    </div>
  );
}

/** The dummy's `num()` - a number field with its unit beside it. */
function NumberField({
  value,
  unit,
  label,
  min,
  max,
  onChange,
}: {
  value: number;
  unit: string;
  label: string;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
      <input
        className="field"
        type="number"
        style={{ width: '6rem' }}
        value={value}
        min={min}
        max={max}
        step={1}
        aria-label={label}
        /* 🔴 The store clamps and rounds; this only refuses the empty box, which
           `valueAsNumber` reports as NaN. Passing NaN through would land the
           store's fallback and silently reset a field mid-edit. */
        onChange={(e) => {
          const next = e.currentTarget.valueAsNumber;
          if (Number.isFinite(next)) onChange(next);
        }}
      />
      <span className="t-sm ink-3">{unit}</span>
    </div>
  );
}

export function SettingsGeneral() {
  const { t } = useTranslation();

  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const idleDays = useStore((s) => s.idleDays);
  const setIdleDays = useStore((s) => s.setIdleDays);
  const tempDays = useStore((s) => s.tempDays);
  const setTempDays = useStore((s) => s.setTempDays);
  const largeFileMb = useStore((s) => s.largeFileMb);
  const setLargeFileMb = useStore((s) => s.setLargeFileMb);

  return (
    <div className="set-grp">
      <SettingRow
        title={t('home.developerTitle')}
        description={developer ? t('home.developerOn', { days: idleDays }) : t('home.developerOff')}
        consequence={t('home.developerNote')}
        control={
          <button
            className="switch"
            type="button"
            role="switch"
            aria-checked={developer}
            aria-label={t('home.developerTitle')}
            onClick={() => { setDeveloper(!developer); }}
          />
        }
      />

      <SettingRow
        title={t('settings.idleTitle')}
        description={t('settings.idleDesc')}
        consequence={t('settings.idleConseq', { value: idleDays })}
        control={
          <NumberField
            value={idleDays}
            unit={t('settings.unitDays')}
            label={t('settings.idleTitle')}
            min={MIN_IDLE_DAYS}
            max={MAX_IDLE_DAYS}
            onChange={setIdleDays}
          />
        }
      />

      <SettingRow
        title={t('settings.tempTitle')}
        description={t('settings.tempDesc')}
        consequence={t('settings.tempConseq', { value: tempDays })}
        control={
          <NumberField
            value={tempDays}
            unit={t('settings.unitDays')}
            label={t('settings.tempTitle')}
            min={MIN_TEMP_DAYS}
            max={MAX_TEMP_DAYS}
            onChange={setTempDays}
          />
        }
      />

      <SettingRow
        title={t('settings.largeTitle')}
        description={t('settings.largeDesc')}
        consequence={t('settings.largeConseq', { value: largeFileMb })}
        control={
          <NumberField
            value={largeFileMb}
            unit={t('settings.unitMb')}
            label={t('settings.largeTitle')}
            min={MIN_LARGE_FILE_MB}
            max={MAX_LARGE_FILE_MB}
            onChange={setLargeFileMb}
          />
        }
      />

      {/* 🔴 DISABLED AND DECLARED, not absent. The engine's own `--install-task`
          reached the Rust allowlist on 2026-09-08, so the flag can now be passed -
          but switching this on would register a real Windows Scheduled Task, and
          three things are still missing before that is honest: nothing can read
          back whether the task exists, so a switch could sit at "on" over a task a
          person deleted in Task Scheduler; the dummy carries no sentence for a
          refusal; and Home's own schedule band still declares the gap, so enabling
          only this one would leave the two screens contradicting each other. A
          declared gap is correct; a control that looks live and is not is the
          worse of the two. */}
      <SettingRow
        title={t('settings.scheduleTitle')}
        description={t('settings.scheduleDesc')}
        consequence={t('settings.scheduleConseq')}
        control={
          <button
            className="switch"
            type="button"
            role="switch"
            aria-checked={false}
            aria-label={t('settings.scheduleTitle')}
            disabled
          />
        }
      />
      <p className="t-xs ink-3">{t('pending.schedule')}</p>
    </div>
  );
}
