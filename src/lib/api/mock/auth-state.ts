import type { components } from "@/types/api";

type User = components["schemas"]["User"];
type UserChild = components["schemas"]["UserChild"];
type ChildInput = components["schemas"]["ChildInput"];

const STORAGE_KEY = "belajarpedia_mock_user";

/**
 * Mock auth state. Browser-only — server-side renders see "logged out".
 * Real backend uses Sanctum SPA cookies; this fake state mirrors
 * the API contract so the UI behaves identically.
 *
 * Live in localStorage so it survives page reloads. SSR fetches that hit
 * /api/user from RSC will return null in mock mode (acceptable since most
 * authenticated UI is client-rendered through useCurrentUser).
 */

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getMockUser(): User | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setMockUser(user: User | null): void {
  if (!isBrowser()) return;
  if (user === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function patchMockUser(patch: Partial<User>): User | null {
  const cur = getMockUser();
  if (!cur) return null;
  const next: User = { ...cur, ...patch, updated_at: new Date().toISOString() };
  setMockUser(next);
  return next;
}

let nextChildId = 1;
function genChildId(): number {
  return Date.now() + nextChildId++;
}

export function listMockChildren(): UserChild[] {
  return getMockUser()?.children ?? [];
}

export function addMockChild(input: ChildInput): UserChild {
  const child: UserChild = {
    ...input,
    id: genChildId(),
    user_id: getMockUser()?.id ?? 0,
    created_at: new Date().toISOString(),
  };
  const cur = getMockUser();
  if (cur) {
    setMockUser({ ...cur, children: [...(cur.children ?? []), child] });
  }
  return child;
}

export function updateMockChild(id: number, input: ChildInput): UserChild | null {
  const cur = getMockUser();
  if (!cur) return null;
  let updated: UserChild | null = null;
  const children = (cur.children ?? []).map((c) => {
    if (c.id !== id) return c;
    updated = { ...c, ...input };
    return updated;
  });
  setMockUser({ ...cur, children });
  return updated;
}

export function deleteMockChild(id: number): boolean {
  const cur = getMockUser();
  if (!cur) return false;
  const before = cur.children?.length ?? 0;
  const children = (cur.children ?? []).filter((c) => c.id !== id);
  if (children.length === before) return false;
  setMockUser({ ...cur, children });
  return true;
}

let nextUserId = 1000;

export function buildMockUser(input: {
  email: string;
  name?: string;
  gender?: User["gender"];
  birthdate?: string;
  phone?: string;
  province_id?: number;
  kabkota_id?: number;
  children?: ChildInput[];
  emailVerified?: boolean;
}): User {
  const now = new Date().toISOString();
  const id = ++nextUserId;
  return {
    id,
    email: input.email,
    name: input.name ?? input.email.split("@")[0],
    gender: input.gender,
    birthdate: input.birthdate,
    phone: input.phone,
    province_id: input.province_id,
    kabkota_id: input.kabkota_id,
    email_verified_at: input.emailVerified === false ? null : now,
    children: (input.children ?? []).map((c, i) => ({
      ...c,
      id: id * 10 + i,
      user_id: id,
      created_at: now,
    })),
    created_at: now,
    updated_at: now,
  };
}
