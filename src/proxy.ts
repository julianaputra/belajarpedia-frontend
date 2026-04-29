import { type NextRequest, NextResponse } from "next/server";

const REALM = "Belajarpedia (restricted)";

/**
 * HTTP Basic Auth gate for staging / development deploys.
 *
 * Enabled when **both** `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` are set as
 * server env vars. Production omits these vars → middleware passes through
 * untouched.
 *
 * Skipped paths (matcher below):
 *   - Next internals (`/_next/static`, `/_next/image`)
 *   - Static public assets (favicon, placeholder)
 *   - Revalidate webhook (already secured by `X-Revalidate-Secret`)
 *   - Sentry tunnel (`/monitoring`)
 */
export function proxy(request: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASSWORD;

  // Disabled when credentials are absent — production-safe by default.
  if (!expectedUser || !expectedPass) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    let decoded: string;
    try {
      decoded = atob(authHeader.slice(6));
    } catch {
      return unauthorized();
    }
    const sep = decoded.indexOf(":");
    if (sep > 0) {
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (
        constantTimeEqual(user, expectedUser) &&
        constantTimeEqual(pass, expectedPass)
      ) {
        return NextResponse.next();
      }
    }
  }

  return unauthorized();
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}

/**
 * Length-checked, branchless string equality. Edge runtime lacks
 * `crypto.timingSafeEqual`; this is the standard alternative.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const config = {
  matcher: [
    // Match everything except: Next internals, public static files,
    // the revalidate webhook (server-to-server, separate secret),
    // and the Sentry tunnel route.
    "/((?!_next/static|_next/image|favicon.ico|placeholder-facility.svg|internal/revalidate|monitoring).*)",
  ],
};
