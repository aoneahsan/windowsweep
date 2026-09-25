/**
 * The ONE module in this window that writes to the console. Every other module logs
 * through `logger`, and `eslint.config.js` refuses `console` everywhere but here.
 *
 * 🔴 THE LEVEL IS `warn`, IN DEVELOPMENT AND IN PRODUCTION ALIKE. `debug` and `info`
 * exist so a module can say more without its call changing when the level does; at
 * `warn` they print nothing, which keeps a shipped window's console to what went wrong.
 *
 * 🔴 WHAT A CALLER MAY HAND IT: a fixed message naming the step, and an error's own
 * message (`errorText`). Never a file path, a folder name, a drive label, a machine or
 * Windows user name, an email address or a token - the list `lib/sync.ts` keeps off the
 * network, kept out of here too, because a console is somewhere people paste from.
 */

/** The four levels, quietest first. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const RANK: Readonly<Record<LogLevel, number>> = { debug: 10, info: 20, warn: 30, error: 40 };

/** Anything below this is dropped. */
const THRESHOLD: LogLevel = 'warn';

/** What may ride along with a message: flat, primitive, and named by the caller. */
export type LogContext = Readonly<Record<string, string | number | boolean | null>>;

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (RANK[level] < RANK[THRESHOLD]) return;
  const line = `[windowsweep] ${message}`;
  if (context) console[level](line, context);
  else console[level](line);
}

/**
 * An error's own message and nothing else. Never its stack: a stack carries the
 * bundle's file locations, and an unknown value is not stringified into a guess.
 */
export function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'unknown error';
}

/** The project logger. `logger.warn('sync: settings read failed', { error: errorText(e) })`. */
export const logger = {
  debug: (message: string, context?: LogContext): void => { write('debug', message, context); },
  info: (message: string, context?: LogContext): void => { write('info', message, context); },
  warn: (message: string, context?: LogContext): void => { write('warn', message, context); },
  error: (message: string, context?: LogContext): void => { write('error', message, context); },
};
