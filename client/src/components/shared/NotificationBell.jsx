import { useState } from "react";
import { Icon } from "../Icon";
import { COLORS } from "../../constants/colors";
import { timeAgo } from "../../utils/helpers";

export function NotificationBell({ notifications, onMarkAllRead, onMarkRead, align = "right" }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 active:scale-95 transition relative"
      >
        <Icon name="bell" className="w-5 h-5" />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold"
            style={{ fontSize: "9px" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-12 ${align === "right" ? "right-0" : "left-0"} w-80 max-w-[85vw] bg-white rounded-2xl shadow-xl z-40 overflow-hidden`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <p className="font-bold text-neutral-900 text-sm">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={() => onMarkAllRead()}
                  className="text-xs font-semibold"
                  style={{ color: COLORS.dark }}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-neutral-400">Empty</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className="w-full text-left px-4 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50 transition flex gap-2.5"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-emerald-500"}`}
                    />
                    <div className="min-w-0">
                      <p className={`text-sm ${n.read ? "text-neutral-500 font-medium" : "text-neutral-900 font-bold"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
                      <p className="text-[11px] text-neutral-300 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
