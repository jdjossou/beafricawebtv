import { urlFor } from '@/sanity/lib/sanityImage';
import { bunnyThumbnailUrl } from '@/lib/bunny';

type VideoImageSource = {
  thumbnail?: unknown; // Sanity image
  stream?: {
    playbackId?: string | null;
    thumbnailUrl?: string | null;
  } | null;
};

export const getVideoThumbnailUrl = (video?: VideoImageSource): string | null => {
  if (!video) {
    return null;
  }

  // 1. Manual Sanity thumbnail (highest priority)
  const sanityThumb = video.thumbnail
    ? urlFor(video.thumbnail).width(1280).height(720).fit('crop').url()
    : null;

  if (sanityThumb) {
    return sanityThumb;
  }

  // 2. Stored Bunny thumbnail URL from Sanity field
  if (video.stream?.thumbnailUrl) {
    return video.stream.thumbnailUrl;
  }

  // 3. Construct Bunny CDN thumbnail from playbackId
  if (video.stream?.playbackId) {
    return bunnyThumbnailUrl(video.stream.playbackId);
  }

  return null;
};
