/**
 * *Show the JSON* - the run's report file, exactly as the engine wrote it.
 *
 * 🔴 IN THE WINDOW, NOT IN AN EDITOR. The dummy's button raised a toast saying it
 * would open the file in a text editor; this build has no permission to open a
 * local path (`src-tauri/capabilities/default.json` grants the opener `https:` and
 * `mailto:` only, deliberately), so the file is shown here instead, read-only - the
 * dummy was amended to draw the same panel. It is the raw text, not a re-serialised
 * copy, so what is on screen is byte for byte what a text editor would show.
 *
 * The scroll box takes focus so a keyboard can scroll it, and is named by the file
 * it shows. Nothing in it leaves the machine; it is rendered, not reported.
 */

export function ReportJson({ id, fileName, raw }: { id: string; fileName: string; raw: string }) {
  return (
    <section className="band band-app band-tight" id={id}>
      <div className="wrap">
        <div className="panel pad">
          <div className="fw-row rep-json-head">
            <code className="mono t-xs ink-3">{fileName}</code>
          </div>
          <div className="rep-json" role="region" aria-label={fileName} tabIndex={0}>
            <pre>{raw}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
