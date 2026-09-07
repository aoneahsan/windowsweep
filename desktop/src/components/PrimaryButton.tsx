/**
 * The primary control, and the ONE place a press is reported.
 *
 * 🔴 The reporting lives here rather than at the eight call sites, because
 * "track every action" asked of feature code quietly fails: every author has to
 * remember, and the ninth one will not. A feature gets its `control.press` by
 * using this component, which is the same argument the theme registry and
 * `controlState` already make in this codebase.
 *
 * 🔴 The first-run notice promises "which buttons you pressed". Before this
 * component the whole tree had three `track()` callers, all in the updater, so
 * that sentence described an event nobody emitted. (PENDING-TASKS TASK-005.)
 *
 * 🔴 The markup is the dummy's, exactly: `btn btn-primary` with an inner
 * `.btn-label` span, because `.btn[data-state='pending']` fades that span and
 * draws the spinner over it. A button without the span has no pending paint at
 * all - the failure this codebase has already met twice with invented classes.
 *
 * 🔴 `controlState` is applied here so the pair cannot come apart: `data-state`
 * answers the eye and `aria-busy` answers the ear, and a control that carries one
 * without the other is the exact defect that helper exists to prevent.
 */

import { useRouterState } from '@tanstack/react-router';

import { track } from '../lib/analytics';
import type { ControlId } from '../lib/events';
import { controlState, type ControlState } from '../lib/control-state';

interface CommonProps {
  /** An id from the closed registry - never a label, which is translated copy. */
  control: ControlId;
  /** Already through `t()` at the call site; this component renders no words. */
  label: React.ReactNode;
  /** The dummy's two size modifiers. Omitted means the base size. */
  size?: 'sm' | 'lg';
  /** Pending while the work runs, done for its moment afterwards. */
  state?: ControlState;
}

/**
 * 🔴 A press handler is required UNLESS the control is disabled. A `pending-wave`
 * control that is declared and switched off has nothing to run, and inventing a
 * no-op handler for it would be the placeholder the no-TODO rule forbids - so the
 * type says so instead of a comment saying so.
 */
type PrimaryButtonProps = CommonProps &
  ({ onPress: () => void; disabled?: boolean } | { onPress?: never; disabled: true });

export function PrimaryButton(props: PrimaryButtonProps) {
  const { control, label, size, state = 'idle', disabled = false } = props;
  const route = useRouterState({ select: (s) => s.location.pathname });

  const className = size ? `btn btn-${size} btn-primary` : 'btn btn-primary';

  return (
    <button
      className={className}
      type="button"
      disabled={disabled}
      onClick={() => {
        /* Reported before the work starts, so a press that then fails is still a
           press. The fan-out to every destination happens inside `track()`. */
        track('control.press', { control, route });
        props.onPress?.();
      }}
      {...controlState(state)}
    >
      <span className="btn-label">{label}</span>
    </button>
  );
}
