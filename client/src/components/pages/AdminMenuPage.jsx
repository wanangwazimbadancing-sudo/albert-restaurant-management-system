import { Icon } from "../Icon";
import { AdminMenuRow } from "../shared/AdminMenuRow";
import { COLORS } from "../../constants/colors";

export function AdminMenuPage({ menu, onAddClick, onEditItem, onDeleteItem }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-extrabold text-neutral-900">Menu</h1>
        <button
          onClick={onAddClick}
          className="text-xs font-semibold px-4 py-2.5 rounded-full text-white flex items-center gap-1.5"
          style={{ background: COLORS.dark }}
        >
          <Icon name="plus" className="w-3.5 h-3.5" /> Add dish
        </button>
      </div>
      <p className="text-sm text-neutral-500 mb-5">{menu.length} dishes on the menu</p>

      <div className="space-y-3">
        {menu.map((item) => (
          <AdminMenuRow key={item.id} item={item} onEdit={onEditItem} onDelete={onDeleteItem} />
        ))}
      </div>
    </div>
  );
}
