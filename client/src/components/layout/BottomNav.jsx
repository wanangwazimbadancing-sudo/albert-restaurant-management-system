import { NavLink } from "react-router-dom";
import { Icon } from "../Icon";

export function BottomNav({ setPage, cartCount, isAdmin }) {
  const items = [
    { id: "home", label: "Home", icon: "home" },
    { id: "cart", label: "Cart", icon: "cart" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "clipboard" }] : []),
    { id: "profile", label: "Profile", icon: "user" },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-30 flex justify-center lg:hidden">
      <div className="bottom-nav-shell flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-2 backdrop-blur-sm">
        {items.map((it) => (
          <NavLink
            key={it.id}
            to={it.id === "home" ? "/" : `/${it.id}`}
            end={it.id === "home"}
            onClick={() => setPage(it.id)}
            className={({ isActive }) =>
              `bottom-nav-item relative flex items-center gap-2 rounded-full transition-all ${
                isActive ? "bottom-nav-item-active navlink-active px-4 py-2.5 text-white shadow-sm" : "w-11 h-11 justify-center text-neutral-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={it.icon} className="w-4 h-4" />
                {isActive && <span className="text-xs font-semibold">{it.label}</span>}
                {it.id === "cart" && cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold"
                    style={{ fontSize: "9px" }}
                  >
                    {cartCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
