import { Moon, Sun } from "lucide-react";
import { Icon } from "../Icon";
import { TopHeader } from "../layout/TopHeader";
import { CATEGORY_STYLE, CATEGORY_LABEL } from "../../constants/colors";

export function ProfilePage({
  name,
  onLogout,
  orderStats,
  notifications,
  onMarkAllRead,
  onMarkRead,
  theme,
  onToggleTheme,
}) {
  const categories = Object.keys(orderStats);
  const total = Object.values(orderStats).reduce((a, b) => a + b, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div>
      <TopHeader
        name={name}
        subtitle="Welcome back"
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
      />
      <h1 className="text-2xl font-extrabold text-neutral-900 mb-1">Your activity</h1>
      <p className="text-sm text-neutral-500 mb-6">Orders from the last 7 days</p>

      <div className="bg-white rounded-3xl shadow-sm border-1 border-neutral-200 p-5 mb-7 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#F1F1F1" strokeWidth="12" />
            {categories.map((cat) => {
              const count = orderStats[cat];
              const frac = total ? count / total : 0;
              const len = frac * circumference;
              const dash = `${len} ${circumference - len}`;
              const el = (
                <circle
                  key={cat}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={CATEGORY_STYLE[cat].accent}
                  strokeWidth="12"
                  strokeDasharray={dash}
                  strokeDashoffset={-offsetAcc}
                  strokeLinecap="round"
                />
              );
              offsetAcc += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-neutral-900">{total}</span>
            <span className="text-xs text-neutral-400">orders</span>
          </div>
        </div>
        <div className="flex-1 w-full space-y-3">
          {categories.map((cat) => {
            const count = orderStats[cat];
            return (
            <div key={cat} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CATEGORY_STYLE[cat].accent }} />
                <span className="text-neutral-600">{CATEGORY_LABEL[cat]}</span>
              </div>
              <span className="font-semibold text-neutral-900">{count} orders</span>
            </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border-1 border-neutral-200 p-5 flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 text-sm truncate">Theme</p>
            <p className="text-xs text-neutral-400">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="w-13 h-7 rounded-full shrink-0 relative transition"
          style={{
            background: theme === "dark" ? "#fff" : "#E5E5E5",
            boxShadow: "inset 0 0 0 1px rgba(15, 23, 42, 0.12)",
          }}
        >
          <span
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
            style={{ left: theme === "dark" ? "26px" : "4px" }}
          />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border-1 border-neutral-200 p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-neutral-900 text-sm truncate">Signed in as {name}</p>
          <p className="text-xs text-neutral-400">Mzuzu, Malawi</p>
        </div>
        <button
          onClick={onLogout}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 flex items-center gap-1.5 shrink-0"
        >
          <Icon name="logout" className="w-3.5 h-3.5" /> Log out
        </button>
      </div>
    </div>
  );
}
