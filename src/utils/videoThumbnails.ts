import { urlFor } from '@/sanity/lib/sanityImage';

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

  const bunnyLibraryId =
    process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '';

  const sanityThumb = video.thumbnail
    ? urlFor(video.thumbnail).width(1280).height(720).fit('crop').url()
    : null;

  if (sanityThumb) {
    return sanityThumb;
  }

  if (video.stream?.thumbnailUrl) {
    return video.stream.thumbnailUrl;
  }

  if (video.stream?.playbackId) {
    if (bunnyLibraryId) {
      return `https://vz-${bunnyLibraryId}-${video.stream.playbackId}.b-cdn.net/thumbnail.jpg`;
    }
  }

  return null;
};
