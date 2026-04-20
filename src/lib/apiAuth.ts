import { NextResponse } from 'next/server';

/**
 * Validate that the incoming request carries the correct API secret.
 *
 * Usage inside a route handler:
 * ```ts
 * const denied = requireApiSecret(req);
 * if (denied) return denied;
 * ```
 *
 * Returns `null` when the request is authorised, or a 401 `NextResponse`
 * when it is not.
 */
export function requireApiSecret(req: Request): NextResponse | null {
  const expected = process.env.API_ROUTE_SECRET;
  if (!expected) {
    // If the env var is missing the route is effectively wide-open, which is
    // dangerous.  Fail closed so nothing works until the secret is configured.
    return NextResponse.json(
      { error: 'Server misconfiguration: API_ROUTE_SECRET is not set.' },
      { status: 500 },
    );
  }

  const provided = req.headers.get('x-api-secret');
  if (!provided || provided !== expected) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  return null; // authorised
}
