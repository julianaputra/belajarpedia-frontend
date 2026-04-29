const STORAGE_KEY = "belajarpedia_mock_favorites";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read(): Set<number> {
  if (!isBrowser()) return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as number[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function write(ids: Set<number>): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function getFavoriteIds(): number[] {
  return [...read()];
}

export function addFavoriteId(id: number): void {
  const set = read();
  set.add(id);
  write(set);
}

export function hasFavoriteId(id: number): boolean {
  return read().has(id);
}

export function clearFavoriteIds(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
