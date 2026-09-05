import { Icon } from "../Icon";

export function Avatar() {
  return (
    <div
      className="avatar-shell w-11 h-11 rounded-full flex items-center justify-center text-neutral-700 shrink-0 bg-slate-100"
    >
      <Icon name="user" className="w-5 h-5" />
    </div>
  );
}
