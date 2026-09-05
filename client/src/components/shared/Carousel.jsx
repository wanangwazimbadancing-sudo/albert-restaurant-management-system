import { useState } from "react";
import { Icon } from "../Icon";
import { COLORS } from "../../constants/colors";

export function Carousel({ items, renderItem, itemsPerViewLg = 3, desktopLayout = "grid", roundedSlides = true }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const goTo = (i) => setIndex(Math.min(count - 1, Math.max(0, i)));
  const atStart = index === 0;
  const atEnd = index === count - 1;

  if (count === 0) return null;

  return (
    <div>
      <div className="relative lg:hidden px-12">
        <div className={roundedSlides ? "overflow-hidden rounded-3xl" : "overflow-hidden"}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((item, i) => (
              <div key={item.id ?? i} className="w-full shrink-0">
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              disabled={atStart}
              aria-label="Previous"
              aria-disabled={atStart}
              className={`absolute top-1/2 -translate-y-1/2 left-0 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center z-10 transition ${
                atStart ? "text-neutral-300 opacity-50 cursor-not-allowed" : "text-neutral-600"
              }`}
            >
              <Icon name="chevronLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={atEnd}
              aria-label="Next"
              aria-disabled={atEnd}
              className={`absolute top-1/2 -translate-y-1/2 right-0 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center z-10 transition ${
                atEnd ? "text-neutral-300 opacity-50 cursor-not-allowed" : "text-neutral-600"
              }`}
            >
              <Icon name="chevronRight" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3 lg:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === index ? "18px" : "6px", background: i === index ? COLORS.dark : "#E5E5E5" }}
            />
          ))}
        </div>
      )}

      {desktopLayout === "row" ? (
        <div className="hidden lg:flex lg:flex-wrap lg:gap-2">
          {items.map((item, i) => (
            <div key={item.id ?? i}>{renderItem(item)}</div>
          ))}
        </div>
      ) : (
        <div className="hidden lg:grid lg:gap-4" style={{ gridTemplateColumns: `repeat(${itemsPerViewLg}, minmax(0, 1fr))` }}>
          {items.map((item, i) => (
            <div key={item.id ?? i}>{renderItem(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
