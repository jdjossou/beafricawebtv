import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/lib/sanity';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';
import type { VideoSanityItem } from '@/types/video';

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 24;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const offsetParam = url.searchParams.get('offset');
  const limitParam = url.searchParams.get('limit');

  const offset = Math.max(Number(offsetParam ?? '0') || 0, 0);
  const requestedLimit = Math.max(Number(limitParam ?? DEFAULT_LIMIT) || DEFAULT_LIMIT, 1);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  try {
    // Single combined query — avoids two separate Sanity API calls.
    const { videos: rawVideos, totalCount } = await sanityClient.fetch<{
      videos: VideoSanityItem[];
      totalCount: number;
    }>(`{
      "videos": *[_type == "video"] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[${offset}...${offset + limit}]{
        _id,
        title,
        slug,
        description,
        thumbnail,
        stream {
          playbackId,
          thumbnailUrl
        },
        publishedAt
      },
      "totalCount": count(*[_type == "video"])
    }`);

    const videos = rawVideos.map((video) => ({
      ...video,
      thumbnailUrl: getVideoThumbnailUrl(video),
    }));

    return NextResponse.json({
      videos,
      totalCount,
      hasMore: offset + videos.length < totalCount,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erreur lors de la récupération des vidéos.';

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

