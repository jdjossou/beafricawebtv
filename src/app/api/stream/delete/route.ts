import {NextResponse} from 'next/server'

export async function POST(req: Request) {
  const libraryId = process.env.BUNNY_LIBRARY_ID
  const apiKey = process.env.BUNNY_API_KEY

  if (!libraryId || !apiKey) {
    return NextResponse.json({error: 'Missing Bunny Stream credentials'}, {status: 500})
  }

  let uid: unknown
  try {
    const body = await req.json()
    uid = body?.uid
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400})
  }

  if (typeof uid !== 'string' || uid.trim() === '') {
    return NextResponse.json({error: 'Missing Bunny Stream video ID'}, {status: 400})
  }

  const normalizedUid = uid.trim()
  const endpoint = `https://video.bunnycdn.com/library/${libraryId}/videos/${normalizedUid}`
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      AccessKey: apiKey,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    let errorPayload: unknown = null
    try {
      errorPayload = await res.json()
    } catch {
      errorPayload = await res.text()
    }
    return NextResponse.json(
      {
        error: 'Unable to delete Bunny Stream asset',
        details: errorPayload,
      },
      {status: res.status},
    )
  }

  return NextResponse.json({deleted: true})
}
