import { STATUS_STYLE, STATUS_LABEL } from "../../constants/colors";

export function StatusBadge({ status }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{ background: style.bg, color: style.text }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
