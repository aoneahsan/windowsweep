/**
 * The dummy's `row()` (`page-settings.js`) - text on the left, one control on the right. Shared by the
 * General and Privacy tabs, so a settings row has one shape in this window, as it has in the dummy.
 */
export function SettingRow({
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
