import { useState } from "react";
import { CategoryArt, Icon } from "../Icon";
import { CATEGORY_LABEL, CATEGORY_STYLE } from "../../constants/colors";
import { formatMK } from "../../utils/helpers";

export function AdminMenuRow({ item, onEdit, onDelete }) {
  const style = CATEGORY_STYLE[item.category];
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-neutral-100">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
        style={{ background: style.bg, color: style.accent }}
      >
        <CategoryArt category={item.category} className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 text-sm truncate">{item.name}</p>
        <p className="text-xs text-neutral-400 truncate">{formatMK(item.price)} · {CATEGORY_LABEL[item.category]}</p>
      </div>
      {confirming ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500 text-white"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"
          >
            <Icon name="edit" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
