import { useState, useMemo } from "react";
import { SearchBar } from "../shared/SearchBar";
import { CategoryRow } from "../shared/CategoryRow";
import { MenuRow } from "../shared/MenuRow";
import { TopHeader } from "../layout/TopHeader";
import { CATEGORY_LABEL } from "../../constants/colors";

export function HomePage({ name, menu, cart, onAdd, notifications, onMarkAllRead, onMarkRead }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const filtered = useMemo(
    () =>
      menu.filter((item) => {
        const matchesCategory = activeCategory ? item.category === activeCategory : true;
        const matchesQuery = query.trim()
          ? `${item.name} ${item.desc}`.toLowerCase().includes(query.trim().toLowerCase())
          : true;
        return matchesCategory && matchesQuery;
      }),
    [menu, query, activeCategory],
  );

  const suggestions = useMemo(() => [...new Set(menu.map((item) => item.name))], [menu]);

  return (
    <div>
      <TopHeader
        name={name}
        subtitle="Welcome back"
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
      />
      <h1 className="text-2xl font-extrabold text-neutral-900 mb-1">Explore our menu</h1>
      <p className="text-sm text-neutral-500 mb-5">Fresh Malawian flavors, made to order.</p>
      <SearchBar value={query} onChange={setQuery} suggestions={suggestions} />
      <CategoryRow active={activeCategory} onSelect={setActiveCategory} />

      <div>
        <h2 className="font-bold text-neutral-900 mb-3">
          {activeCategory ? CATEGORY_LABEL[activeCategory] : "All dishes"}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <MenuRow
              key={item.id}
              item={item}
              onAdd={onAdd}
              qty={cart[item.id] || 0}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-neutral-400 py-8 text-center col-span-full">No dishes match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
