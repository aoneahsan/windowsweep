/**
 * The control-state vocabulary, in one place.
 *
 * §12 of the frontend standards: every action is acknowledged AT the control
 * within about 100 ms, and a toast is the fallback rather than the default. The
 * click dummy already carries the paint for this - `.btn[data-state='pending']`
 * draws a spinner and fades the label, `.btn[data-state='done']` draws a tick -
 * and `widgets.js` pairs it with `aria-busy`, because the spinner is visual only
 * and a green tick is nothing to a screen reader.
 *
 * 🔴 Both halves or neither. A `data-state` without `aria-busy` is a control that
 * answers the eye and not the ear, which is the failure this helper exists to make
 * impossible to repeat across eleven screens.
 */

export type ControlState = 'idle' | 'pending' | 'done';

interface ControlStateProps {
  'data-state'?: 'pending' | 'done';
  'aria-busy'?: true;
}

/** Spread onto the button that was pressed - never onto a different element. */
export function controlState(state: ControlState): ControlStateProps {
  if (state === 'pending') return { 'data-state': 'pending', 'aria-busy': true };
  if (state === 'done') return { 'data-state': 'done' };
  return {};
}

/** The common case: one control, two booleans, read in the order they happen. */
export function stateOf(pending: boolean, done = false): ControlState {
  if (pending) return 'pending';
  if (done) return 'done';
  return 'idle';
}
