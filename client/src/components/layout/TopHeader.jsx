import { Avatar } from "../shared/Avatar";
import { NotificationBell } from "../shared/NotificationBell";

export function TopHeader({ name, subtitle, notifications, onMarkAllRead, onMarkRead }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="text-sm text-neutral-500 leading-tight">Hi, {name}</p>
          <p className="text-lg font-bold text-neutral-900 leading-tight">{subtitle}</p>
        </div>
      </div>
      <NotificationBell notifications={notifications} onMarkAllRead={onMarkAllRead} onMarkRead={onMarkRead} />
    </div>
  );
}
