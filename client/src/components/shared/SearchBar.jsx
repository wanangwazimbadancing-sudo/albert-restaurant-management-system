import { useMemo, useState } from "react";
import { Icon } from "../Icon";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange, suggestions = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleSuggestions = useMemo(() => {
    if (!value.trim()) return [];

    const normalized = value.trim().toLowerCase();
    return suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [value, suggestions]);

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6">
      <div className="search-bar flex items-center gap-3 rounded-2xl bg-neutral-100/60 px-3 py-2 ">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder="What type of meal are you craving?"
          className="search-input flex-1 min-w-0 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
        />
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c6c6c8] text-white"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>

      {isOpen && value.trim() && visibleSuggestions.length > 0 && (
        <div className="search-suggestions absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
          {visibleSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-neutral-700 transition hover:bg-slate-50"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="text-neutral-500">
                  <Icon name="search" className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-medium">{suggestion}</span>
              </span>
              <span className="text-neutral-400">
                <Icon name="chevronRight" className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
