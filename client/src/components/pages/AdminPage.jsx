import { useState } from "react";
import { NotificationBell } from "../shared/NotificationBell";
import { AdminOrdersPage } from "./AdminOrdersPage";
import { AdminMenuPage } from "./AdminMenuPage";
import { COLORS } from "../../constants/colors";

export function AdminPage({
  orders,
  onUpdateStatus,
  menu,
  onAddClick,
  onEditItem,
  onDeleteItem,
  notifications,
  onMarkAllRead,
  onMarkRead,
}) {
  const [tab, setTab] = useState("orders");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight">Admin dashboard</h1>
          <p className="text-sm text-neutral-500">Manage orders &amp; the menu</p>
        </div>
        <NotificationBell notifications={notifications} onMarkAllRead={onMarkAllRead} onMarkRead={onMarkRead} />
      </div>

      <div className="flex items-center gap-2 bg-white rounded-full shadow-sm p-1.5 mb-6 max-w-xs">
        {[
          { id: "orders", label: "Orders" },
          { id: "menu", label: "Menu" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-sm font-semibold py-2 rounded-full transition ${
                active ? "text-white" : "text-neutral-500"
              }`}
              style={active ? { background: COLORS.dark } : {}}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "orders" ? (
        <AdminOrdersPage orders={orders} onUpdateStatus={onUpdateStatus} />
      ) : (
        <AdminMenuPage menu={menu} onAddClick={onAddClick} onEditItem={onEditItem} onDeleteItem={onDeleteItem} />
      )}
    </div>
  );
}
