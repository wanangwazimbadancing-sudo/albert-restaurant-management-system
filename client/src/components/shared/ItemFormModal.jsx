import { useState } from "react";
import { Icon, CategoryArt } from "../Icon";
import { CATEGORY_LABEL, CATEGORY_STYLE, COLORS } from "../../constants/colors";

export function ItemFormModal({ initial, onSave, onClose }) {
  const isNew = !initial;
  const [form, setForm] = useState(
    initial || { name: "", category: "rice", price: "", desc: "" }
  );
  const canSave = form.name.trim() && Number(form.price) > 0;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-neutral-900 bg-opacity-40 sm:px-6">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <p className="font-extrabold text-lg text-neutral-900">{isNew ? "Add dish" : "Edit dish"}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Dish name</label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Jollof Rice"
              className="w-full bg-neutral-100 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(CATEGORY_LABEL).map((c) => {
                const active = form.category === c;
                const style = CATEGORY_STYLE[c];
                return (
                  <button
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, category: c }))}
                    className="flex flex-col items-center gap-1.5 py-2 rounded-xl transition"
                    style={{ background: active ? style.accent : style.bg, color: active ? "#fff" : style.accent }}
                  >
                    <CategoryArt category={c} className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">{CATEGORY_LABEL[c]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Price (MK)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={set("price")}
              placeholder="e.g. 3500"
              className="w-full bg-neutral-100 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Description</label>
            <textarea
              value={form.desc}
              onChange={set("desc")}
              rows={3}
              placeholder="Short, appetizing description"
              className="w-full bg-neutral-100 rounded-xl px-3.5 py-2.5 text-sm text-neutral-800 outline-none resize-none"
            />
          </div>

        </div>

        <div className="px-6 pt-3 pb-6 shrink-0 border-t border-neutral-100">
          <button
            onClick={() => canSave && onSave({ ...form, price: Number(form.price) })}
            disabled={!canSave}
            className="w-full py-3.5 rounded-full text-white font-semibold disabled:opacity-40"
            style={{ background: COLORS.dark }}
          >
            {isNew ? "Add to menu" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
