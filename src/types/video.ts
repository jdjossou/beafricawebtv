/**
 * Shared video types used across pages, API routes, and components.
 */

/** Shape of a video document returned by Sanity GROQ queries. */
export type VideoSanityItem = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  thumbnail?: unknown;
  stream?: {
    playbackId?: string | null;
    uid?: string | null;
    duration?: number | null;
    thumbnailUrl?: string | null;
  } | null;
  publishedAt?: string;
};

/** VideoSanityItem enriched with a resolved thumbnail URL. */
export type VideoPreview = VideoSanityItem & {
  thumbnailUrl: string | null;
};
