"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const YEAR_PAGE_SIZE = 12;

type Props = {
  /** ISO YYYY-MM-DD or empty string. */
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  /** ISO YYYY-MM-DD lower bound (inclusive). */
  min?: string;
  /** ISO YYYY-MM-DD upper bound (inclusive). */
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Year to anchor the year-grid on when value is empty. Defaults to (today - 30). */
  defaultViewYear?: number;
};

/**
 * 3-step date picker: Year → Month → Day.
 *
 * Empty by default. On open, shows a 12-year year grid; selecting advances to
 * the 12-month grid; selecting advances to a calendar day grid. Picking a day
 * commits the value and closes the popover.
 *
 * Designed for birthdate flows where typing year-first is much faster than
 * scrubbing through native picker month chevrons.
 */
export function DatePicker({
  value,
  onChange,
  onBlur,
  id,
  name,
  min,
  max,
  placeholder = "Pilih tanggal",
  disabled,
  className,
  defaultViewYear,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"year" | "month" | "day">("year");
  const [pendingYear, setPendingYear] = React.useState<number | null>(null);
  const [pendingMonth, setPendingMonth] = React.useState<number | null>(null);

  const seedYear = React.useMemo(() => {
    if (value) return parseISO(value).getFullYear();
    if (defaultViewYear !== undefined) return defaultViewYear;
    return new Date().getFullYear() - 30;
  }, [value, defaultViewYear]);

  const [yearPageStart, setYearPageStart] = React.useState<number>(() =>
    Math.floor(seedYear / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE,
  );

  const minDate = min ? parseISO(min) : null;
  const maxDate = max ? parseISO(max) : null;

  // Close on outside click
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

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onBlur]);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
    if (value) {
      const d = parseISO(value);
      setPendingYear(d.getFullYear());
      setPendingMonth(d.getMonth());
      setYearPageStart(Math.floor(d.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE);
      setView("day");
    } else {
      setPendingYear(null);
      setPendingMonth(null);
      setView("year");
    }
  };

  const handleSelectYear = (y: number) => {
    setPendingYear(y);
    setView("month");
  };

  const handleSelectMonth = (m: number) => {
    setPendingMonth(m);
    setView("day");
  };

  const handleSelectDay = (day: number) => {
    if (pendingYear === null || pendingMonth === null) return;
    onChange(toISO(pendingYear, pendingMonth, day));
    setOpen(false);
    onBlur?.();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Hidden input — for native form fallback / testing tools. RHF should
          use Controller and read value/onChange directly. */}
      {name !== undefined && (
        <input type="hidden" name={name} value={value} readOnly />
      )}

      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={open ? () => setOpen(false) : handleOpen}
        className={cn(
          "h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5",
          "text-base text-left inline-flex items-center gap-2",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-ink-300",
          open &&
            "border-brand-500 shadow-[0_0_0_3px_var(--color-brand-100)]",
          "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-50",
        )}
      >
        <CalendarIcon
          size={16}
          aria-hidden
          className="text-ink-400 flex-shrink-0"
        />
        <span className={cn("flex-1 truncate", value ? "text-body" : "text-muted")}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        {value && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Hapus tanggal"
            onClick={handleClear}
            className="text-ink-400 hover:text-ink-700 -mr-1 p-1 rounded hover:bg-ink-50"
          >
            <X size={14} aria-hidden />
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Pilih tanggal"
          className="absolute z-50 left-0 right-0 mt-2 min-w-[18rem] max-w-sm rounded-lg bg-white border border-ink-100 shadow-[0_10px_30px_-10px_rgb(28_47_112_/_0.25)] p-3 animate-[var(--animate-fade-up)]"
        >
          {view === "year" && (
            <YearGrid
              pageStart={yearPageStart}
              onPage={setYearPageStart}
              onSelect={handleSelectYear}
              value={pendingYear}
              minYear={minDate?.getFullYear()}
              maxYear={maxDate?.getFullYear()}
            />
          )}
          {view === "month" && pendingYear !== null && (
            <MonthGrid
              year={pendingYear}
              value={pendingMonth}
              onSelect={handleSelectMonth}
              onBack={() => setView("year")}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
          {view === "day" && pendingYear !== null && pendingMonth !== null && (
            <DayGrid
              year={pendingYear}
              month={pendingMonth}
              currentValue={value ? parseISO(value) : null}
              onSelect={handleSelectDay}
              onBack={() => setView("month")}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Year grid
// =============================================================================

function YearGrid({
  pageStart,
  onPage,
  onSelect,
  value,
  minYear,
  maxYear,
}: {
  pageStart: number;
  onPage: (n: number) => void;
  onSelect: (y: number) => void;
  value: number | null;
  minYear?: number;
  maxYear?: number;
}) {
  const years = Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => pageStart + i);
  const canPrev = minYear === undefined || pageStart - 1 >= minYear;
  const canNext = maxYear === undefined || pageStart + YEAR_PAGE_SIZE <= maxYear;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => onPage(pageStart - YEAR_PAGE_SIZE)}
          disabled={!canPrev}
          aria-label="Halaman tahun sebelumnya"
          className="p-1.5 rounded-md text-ink-700 hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <span className="text-sm font-semibold text-ink-700">
          Pilih tahun: {pageStart} – {pageStart + YEAR_PAGE_SIZE - 1}
        </span>
        <button
          type="button"
          onClick={() => onPage(pageStart + YEAR_PAGE_SIZE)}
          disabled={!canNext}
          aria-label="Halaman tahun berikutnya"
          className="p-1.5 rounded-md text-ink-700 hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {years.map((y) => {
          const disabled =
            (minYear !== undefined && y < minYear) ||
            (maxYear !== undefined && y > maxYear);
          const isActive = y === value;
          return (
            <button
              key={y}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(y)}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-700 text-white"
                  : disabled
                    ? "text-ink-200 cursor-not-allowed"
                    : "text-ink-700 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Month grid
// =============================================================================

function MonthGrid({
  year,
  value,
  onSelect,
  onBack,
  minDate,
  maxDate,
}: {
  year: number;
  value: number | null;
  onSelect: (m: number) => void;
  onBack: () => void;
  minDate: Date | null;
  maxDate: Date | null;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke pilih tahun"
          className="p-1.5 rounded-md text-ink-700 hover:bg-ink-50"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <span className="text-sm font-semibold text-ink-700">
          Pilih bulan {year}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS_SHORT.map((label, m) => {
          const monthEnd = new Date(year, m + 1, 0);
          const monthStart = new Date(year, m, 1);
          const disabled =
            (minDate !== null && monthEnd < monthStartOf(minDate)) ||
            (maxDate !== null && monthStart > maxDate);
          const isActive = m === value;
          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(m)}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-700 text-white"
                  : disabled
                    ? "text-ink-200 cursor-not-allowed"
                    : "text-ink-700 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Day grid
// =============================================================================

function DayGrid({
  year,
  month,
  currentValue,
  onSelect,
  onBack,
  minDate,
  maxDate,
}: {
  year: number;
  month: number;
  currentValue: Date | null;
  onSelect: (d: number) => void;
  onBack: () => void;
  minDate: Date | null;
  maxDate: Date | null;
}) {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build cells with leading blanks for offset
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke pilih bulan"
          className="p-1.5 rounded-md text-ink-700 hover:bg-ink-50"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <span className="text-sm font-semibold text-ink-700">
          {MONTHS_FULL[month]} {year}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="h-7 text-[11px] font-semibold text-muted flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`blank-${i}`} />;
          const cellDate = new Date(year, month, d);
          const disabled =
            (minDate !== null && cellDate < minDate) ||
            (maxDate !== null && cellDate > maxDate);
          const isActive =
            currentValue !== null &&
            cellDate.getFullYear() === currentValue.getFullYear() &&
            cellDate.getMonth() === currentValue.getMonth() &&
            cellDate.getDate() === currentValue.getDate();
          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d)}
              className={cn(
                "h-9 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-700 text-white"
                  : disabled
                    ? "text-ink-200 cursor-not-allowed"
                    : "text-ink-700 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthStartOf(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDisplay(iso: string): string {
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
}
