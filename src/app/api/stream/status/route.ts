import {NextResponse} from 'next/server'

const POLL_INTERVAL_MS = 4000
const MAX_WAIT_MS = 5 * 60 * 1000

type BunnyVideoResult = {
  guid?: string
  status?: number
  encodeProgress?: number
  availableResolutions?: string | null
  thumbnailFileName?: string | null
  length?: number | null
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function normalizePct(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, value))
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed))
    }
  }
  return null
}

function isReady(result: BunnyVideoResult): boolean {
  if (!result) return false
  if (result.status === 4) return true // finished

  const resolutions = result.availableResolutions
  if (typeof resolutions === 'string' && resolutions.trim()) {
    return true
  }

  return false
}

function buildThumbnailUrl(libraryId: string, videoId: string, fileName?: string | null): string {
  const name = (fileName && fileName.trim()) || 'thumbnail.jpg'
  return `https://vz-${libraryId}-${videoId}.b-cdn.net/${name}`
}

export async function POST(req: Request) {
  const libraryId = process.env.BUNNY_LIBRARY_ID
  const apiKey = process.env.BUNNY_API_KEY

  if (!libraryId || !apiKey) {
    return NextResponse.json({error: 'Missing Bunny Stream credentials'}, {status: 500})
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400})
  }

  const uid = (body as {uid?: string})?.uid
  if (!uid) {
    return NextResponse.json({error: 'Missing uid'}, {status: 400})
  }

  const endpoint = `https://video.bunnycdn.com/library/${libraryId}/videos/${uid}`
  const startedAt = Date.now()

  for (;;) {
    const res = await fetch(endpoint, {
      headers: {AccessKey: apiKey},
      cache: 'no-store',
    })

    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = null
    }

    console.log('[Bunny Stream status]', JSON.stringify(data, null, 2))

    if (!res.ok || !data || typeof data !== 'object') {
      return NextResponse.json({error: data}, {status: res.status || 502})
    }

    const result = data as BunnyVideoResult
    const progress = normalizePct(result.encodeProgress)
    const playbackId = typeof result.guid === 'string' && result.guid ? result.guid : uid
    const ready = isReady(result)
    const errored = result.status === 5
    const payload = {
      readyToStream: ready,
      status: typeof result.status === 'number' ? String(result.status) : null,
      progress,
      errorReason: null,
      playbackId,
      uid,
      duration: typeof result.length === 'number' ? result.length : null,
      thumbnail: buildThumbnailUrl(libraryId, playbackId, result.thumbnailFileName),
      raw: data,
    }

    if (errored) {
      return NextResponse.json(payload, {status: 502})
    }

    if (ready) {
      return NextResponse.json(payload)
    }

    if (Date.now() - startedAt >= MAX_WAIT_MS) {
      return NextResponse.json(
        {
          ...payload,
          timedOut: true,
          timeoutMs: MAX_WAIT_MS,
        },
        {status: 504},
      )
    }

    await wait(POLL_INTERVAL_MS)
  }
}
