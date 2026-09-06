import { NavLink } from "react-router-dom";
import { Icon } from "../Icon";
import { Avatar } from "../shared/Avatar";
import img from "../../assets/logo.png";

export function Sidebar({ setPage, cartCount, name, isAdmin }) {
  const items = [
    { id: "home", label: "Home", icon: "home" },
    { id: "cart", label: "Cart", icon: "cart" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "clipboard" }] : []),
    { id: "profile", label: "Profile", icon: "user" },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 py-8 px-6 border-r border-neutral-200 bg-white">
      <div className="flex items-center gap-2 mb-10 text-neutral-900">
        <img src={img} alt="Logo" className="w-8 h-8" />
        <span className="font-semibold text-lg tracking-tight">Urunji Quick Dine</span>
      </div>
      <nav className="space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.id}
            to={it.id === "home" ? "/" : `/${it.id}`}
            end={it.id === "home"}
            onClick={() => setPage(it.id)}
            className={({ isActive }) =>
              `sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-hover text-neutral-500"
              }`
            }
          >
            <Icon name={it.icon} className="w-4 h-4" />
            {it.label}
            {it.id === "cart" && cartCount > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 bg-white rounded-2xl p-3">
        <Avatar size="w-9 h-9" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{name}</p>
          <p className="text-xs text-neutral-400 truncate">Mzuzu, Malawi</p>
        </div>
      </div>
    </div>
  );
}
