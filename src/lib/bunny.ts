/**
 * Centralised Bunny.net configuration.
 *
 * Server-only values (API key) are plain `process.env` reads.
 * Client-safe values use the `NEXT_PUBLIC_` prefix so Next.js
 * inlines them into the client bundle.
 */

/** Bunny Stream library ID (safe to expose — it appears in embed URLs). */
export const bunnyLibraryId =
  process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '';

/** Bunny CDN pull-zone hostname, e.g. `vz-8ac1ca09-0b6.b-cdn.net`. */
export const bunnyCdnHostname =
  process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME || '';

/**
 * Build a Bunny CDN thumbnail URL for a given video.
 *
 * Pattern: `https://{cdnHostname}/{videoId}/thumbnail.jpg`
 */
export function bunnyThumbnailUrl(
  videoId: string,
  filename = 'thumbnail.jpg',
): string | null {
  if (!bunnyCdnHostname || !videoId) return null;
  return `https://${bunnyCdnHostname}/${videoId}/${filename}`;
}

/**
 * Build a Bunny Stream embed URL.
 *
 * Pattern: `https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}`
 */
export function bunnyEmbedUrl(videoId: string): string | null {
  if (!bunnyLibraryId || !videoId) return null;
  return `https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${videoId}`;
}
