import { Icon } from "../Icon";
import { COLORS, STATUS_LABEL } from "../../constants/colors";
import { ORDER_STATUSES } from "../../constants/menu";
import { formatDateTime, formatMK, timeAgo } from "../../utils/helpers";
import { StatusBadge } from "../shared/StatusBadge";
import { Carousel } from "../shared/Carousel";
import { useState, useMemo } from "react";

export function AdminOrdersPage({ orders, onUpdateStatus }) {
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c = { all: orders.length };
    ORDER_STATUSES.forEach((s) => (c[s] = 0));
    orders.forEach((o) => (c[o.status] = (c[o.status] || 0) + 1));
    return c;
  }, [orders]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusChips = ["all", ...ORDER_STATUSES];
  const statusPages = useMemo(() => {
    const size = 3;
    const pages = [];
    for (let i = 0; i < statusChips.length; i += size) pages.push(statusChips.slice(i, i + size));
    return pages;
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-neutral-900 mb-1">Orders</h1>
      <p className="text-sm text-neutral-500 mb-5">
        {orders.length} {orders.length === 1 ? "order" : "orders"} total
      </p>

      <div className="mb-5">
        <Carousel
          items={statusPages}
          desktopLayout="row"
          roundedSlides={false}
          renderItem={(group) => (
            <div className="flex gap-2">
              {group.map((s) => {
                const active = filter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition ${
                      active ? "text-white" : "bg-white text-neutral-500"
                    }`}
                    style={active ? { background: COLORS.dark } : {}}
                  >
                    {s === "all" ? "All" : STATUS_LABEL[s]}
                    <span className={`ml-1.5 ${active ? "opacity-70" : "text-neutral-400"}`}>{counts[s] || 0}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 bg-white rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Icon name="clipboard" className="w-7 h-7" />
          </div>
          <p className="font-semibold text-neutral-900 mb-1">No orders here</p>
          <p className="text-sm text-neutral-400 max-w-xs px-6">Orders placed at checkout will show up in this list.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const canCancel = order.status !== "completed" && order.status !== "cancelled";
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-900 text-sm truncate">{order.id}</p>
                    <p className="text-xs text-neutral-400">
                      {order.customer} · {formatDateTime(order.createdAt)} · {timeAgo(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="truncate">
                        {it.qty}× {it.name}
                      </span>
                      <span className="shrink-0 ml-2">{formatMK(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-neutral-100 mb-3" />

                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-neutral-900 text-sm">{formatMK(order.total)}</span>
                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={() => onUpdateStatus(order.id, "cancelled")}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-500"
                      >
                        Cancel
                      </button>
                    )}
                    <label className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-600">
                      <span className="hidden sm:inline">Status</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className="bg-transparent text-xs font-semibold text-neutral-700 outline-none"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
