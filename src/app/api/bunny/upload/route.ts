import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireApiSecret } from '@/lib/apiAuth';

type ClientPayload = {
  filename?: string;
  filetype?: string;
  filesize?: number;
  maxDurationSeconds?: number;
};

const DEFAULT_MAX_DURATION_SECONDS = 60 * 60 * 3;
const BUNNY_TUS_ENDPOINT = 'https://video.bunnycdn.com/tusupload';
const SIGNATURE_TTL_SECONDS = 60 * 60; // 1 hour

function sanitizeFilename(value: string | undefined): string {
  if (!value) return 'upload';
  const trimmed = value.trim();
  if (!trimmed) return 'upload';
  return (
    trimmed
      .normalize('NFKD')
      .replace(/[^\w.\- ]+/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 150) || 'upload'
  );
}

// Bunny docs: sha256(library_id + api_key + expiration_time + video_id)
function buildSignature(
  libraryId: string,
  apiKey: string,
  expires: number,
  videoId: string,
): string {
  return createHash('sha256')
    .update(`${libraryId}${apiKey}${expires}${videoId}`)
    .digest('hex');
}

export async function POST(req: NextRequest) {
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

  // ── Parse payload ──────────────────────────────────────────
  let payload: ClientPayload;
  try {
    payload = (await req.json()) as ClientPayload;
  } catch {
    return NextResponse.json(
      { error: 'Invalid upload payload' },
      { status: 400 },
    );
  }

  const { filename, filetype, filesize, maxDurationSeconds } = payload ?? {};

  if (
    typeof filesize !== 'number' ||
    Number.isNaN(filesize) ||
    filesize <= 0
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid filesize' },
      { status: 400 },
    );
  }

  const safeFilename = sanitizeFilename(filename);
  const safeFiletype =
    typeof filetype === 'string' && filetype.trim()
      ? filetype.trim()
      : 'application/octet-stream';
  const duration =
    typeof maxDurationSeconds === 'number' && maxDurationSeconds > 0
      ? maxDurationSeconds
      : DEFAULT_MAX_DURATION_SECONDS;

  // 1) Create the video object in Bunny (returns a GUID)
  const createRes = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: 'POST',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: safeFilename, collectionId: null }),
    },
  );

  const createBodyText = await createRes.text();
  let createData: unknown = null;
  try {
    createData = createBodyText ? JSON.parse(createBodyText) : null;
  } catch {
    createData = createBodyText || null;
  }

  if (!createRes.ok) {
    return NextResponse.json(
      { error: 'Unable to create Bunny video', details: createData },
      { status: createRes.status || 502 },
    );
  }

  const videoId =
    (createData && typeof createData === 'object'
      ? (createData as { guid?: string }).guid
      : null) ?? null;

  if (!videoId) {
    return NextResponse.json(
      { error: 'Bunny did not return a video GUID' },
      { status: 502 },
    );
  }

  // 2) Precompute signature/expiry for TUS requests
  const expires = Math.floor(Date.now() / 1000) + SIGNATURE_TTL_SECONDS;
  const signature = buildSignature(libraryId, apiKey, expires, videoId);

  // 3) Return the TUS endpoint + headers the client must send
  const tusHeaders = {
    AuthorizationSignature: signature,
    AuthorizationExpire: String(expires),
    VideoId: videoId,
    LibraryId: libraryId,
  };

  return NextResponse.json({
    uploadURL: BUNNY_TUS_ENDPOINT,
    uid: videoId,
    signature,
    expires,
    libraryId,
    tusHeaders,
    maxDurationSeconds: duration,
    safeFiletype,
  });
}
