import { CategoryArt, Icon } from "../Icon";
import { CATEGORY_LABEL, CATEGORY_STYLE } from "../../constants/colors";

export function CategoryRow({ active, onSelect }) {
  const cats = ["rice", "chips", "nsima", "dessert"];
  return (
    <div className="grid grid-cols-4 gap-3 mb-7">
      {cats.map((c) => {
        const style = CATEGORY_STYLE[c];
        const isActive = active === c;
        return (
          <button
            key={c}
            onClick={() => onSelect(isActive ? null : c)}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center transition"
              style={{
                background: isActive ? style.accent : style.bg,
                color: isActive ? "#fff" : style.accent,
              }}
            >
              <CategoryArt category={c} className="w-7 h-7" />
            </div>
            <span className={`text-xs font-medium ${isActive ? "text-neutral-900" : "text-neutral-500"}`}>
              {CATEGORY_LABEL[c]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
