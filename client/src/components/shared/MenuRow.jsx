import { CategoryArt, Icon } from "../Icon";
import { CATEGORY_STYLE } from "../../constants/colors";
import { formatMK } from "../../utils/helpers";

export function MenuRow({ item, onAdd, qty }) {
  const style = CATEGORY_STYLE[item.category];
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-neutral-100 transition hover:border-neutral-200">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
        style={{ background: style.bg, color: style.accent }}
      >
        <CategoryArt category={item.category} className="h-7 w-7" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-neutral-900 text-sm truncate">{item.name}</p>
        </div>
        <p className="text-xs text-neutral-400 truncate mt-0.5">{item.desc}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-neutral-900">{formatMK(item.price)}</span>
          <button
            onClick={() => onAdd(item.id)}
            className="text-xs font-semibold px-3 py-1 rounded-full text-white flex items-center gap-1"
            style={{ background: style.accent }}
          >
            <Icon name="plus" className="w-3 h-3" />
            {qty > 0 ? `Add (${qty})` : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
