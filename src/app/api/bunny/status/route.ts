import { NextResponse } from 'next/server';
import { requireApiSecret } from '@/lib/apiAuth';
import { bunnyThumbnailUrl } from '@/lib/bunny';

type BunnyVideoResult = {
  guid?: string;
  status?: number;
  encodeProgress?: number;
  availableResolutions?: string | null;
  thumbnailFileName?: string | null;
  length?: number | null;
};

function normalizePct(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, value));
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed));
    }
  }
  return null;
}

function isReady(result: BunnyVideoResult): boolean {
  if (!result) return false;
  if (result.status === 4) return true; // finished

  const resolutions = result.availableResolutions;
  if (typeof resolutions === 'string' && resolutions.trim()) {
    return true;
  }

  return false;
}

/**
 * Single-fetch status check — no server-side polling.
 *
 * The client (StreamUploadInput) already runs its own polling loop that
 * calls this endpoint repeatedly. Having the server also poll internally
 * was redundant and exceeded Vercel's function timeout.
 */
export async function POST(req: Request) {
  // ── Auth gate ──────────────────────────────────────────────
  const denied = requireApiSecret(req);
  if (denied) return denied;

  // ── Credentials ────────────────────────────────────────────
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const apiKey = process.env.BUNNY_API_KEY;

  if (!libraryId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Bunny Stream credentials' },
      { status: 500 },
    );
  }

  // ── Parse body ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  const uid = (body as { uid?: string })?.uid;
  if (!uid) {
    return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
  }

  // ── Single fetch to Bunny ──────────────────────────────────
  const endpoint = `https://video.bunnycdn.com/library/${libraryId}/videos/${uid}`;
  const res = await fetch(endpoint, {
    headers: { AccessKey: apiKey },
    cache: 'no-store',
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data || typeof data !== 'object') {
    return NextResponse.json({ error: data }, { status: res.status || 502 });
  }

  const result = data as BunnyVideoResult;
  const progress = normalizePct(result.encodeProgress);
  const playbackId =
    typeof result.guid === 'string' && result.guid ? result.guid : uid;
  const ready = isReady(result);
  const errored = result.status === 5;

  const thumbnail = bunnyThumbnailUrl(
    playbackId,
    result.thumbnailFileName ?? 'thumbnail.jpg',
  );

  const payload = {
    readyToStream: ready,
    status: typeof result.status === 'number' ? String(result.status) : null,
    progress,
    errorReason: null,
    playbackId,
    uid,
    duration: typeof result.length === 'number' ? result.length : null,
    thumbnail,
    raw: data,
  };

  if (errored) {
    return NextResponse.json(payload, { status: 502 });
  }

  return NextResponse.json(payload);
}
