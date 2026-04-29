"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /** Controls whether to clear value when "" is selected. Default true. */
  clearable?: boolean;
};

/**
 * Searchable select / combobox.
 *
 * Trigger button (looks like an input). On open: search input + filtered
 * listbox. Keyboard: ↑/↓ navigate, Enter select, Esc close.
 *
 * For RHF, wrap with `<Controller>`.
 */
export function SearchableSelect({
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Pilih",
  searchPlaceholder = "Cari…",
  emptyText = "Tidak ditemukan",
  disabled,
  id,
  name,
  className,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selected = options.find((o) => o.value === value);

  // Click outside → close
  React.useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onBlur]);

  // Focus search input once popover renders.
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      // Reset state for fresh open.
      setQuery("");
      const idx = options.findIndex((o) => o.value === value);
      setActiveIdx(idx >= 0 ? idx : 0);
    }
    setOpen((o) => !o);
  };

  // Clamp during render (no effect needed — query changes already reset
  // activeIdx via the search input's onChange handler).
  const clampedActiveIdx =
    filtered.length === 0
      ? 0
      : Math.min(Math.max(activeIdx, 0), filtered.length - 1);

  const commit = (v: string) => {
    onChange(v);
    setOpen(false);
    onBlur?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[clampedActiveIdx];
      if (opt) commit(opt.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      onBlur?.();
    }
  };

  // Auto-scroll active item into view
  React.useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector<HTMLElement>(
      `[data-idx="${clampedActiveIdx}"]`,
    );
    if (item) item.scrollIntoView({ block: "nearest" });
  }, [clampedActiveIdx, open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {name !== undefined && (
        <input type="hidden" name={name} value={value} readOnly />
      )}

      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
        className={cn(
          "h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5 pr-10",
          "text-base text-left inline-flex items-center gap-2",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-ink-300",
          open &&
            "border-brand-500 shadow-[0_0_0_3px_var(--color-brand-100)]",
          "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-50",
        )}
      >
        <span
          className={cn(
            "flex-1 truncate",
            selected ? "text-body" : "text-muted",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn(
            "text-ink-400 transition-transform absolute right-3",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 rounded-lg bg-white border border-ink-100 shadow-[0_10px_30px_-10px_rgb(28_47_112_/_0.25)] overflow-hidden animate-[var(--animate-fade-up)]"
        >
          <div className="border-b border-ink-100 p-2">
            <div className="relative">
              <Search
                size={16}
                aria-hidden
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={id ? `${id}-list` : undefined}
                aria-autocomplete="list"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <ul
            ref={listRef}
            id={id ? `${id}-list` : undefined}
            role="listbox"
            className="max-h-64 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-sm text-muted text-center">
                {emptyText}
              </li>
            ) : (
              filtered.map((o, i) => {
                const isActive = i === clampedActiveIdx;
                const isSelected = o.value === value;
                return (
                  <li
                    key={o.value}
                    role="option"
                    aria-selected={isSelected}
                    data-idx={i}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => commit(o.value)}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-2",
                      isActive
                        ? "bg-brand-50 text-brand-800"
                        : "text-ink-700 hover:bg-ink-50",
                      isSelected && "font-semibold",
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {isSelected && (
                      <Check
                        size={16}
                        aria-hidden
                        className="text-brand-700 flex-shrink-0"
                      />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
