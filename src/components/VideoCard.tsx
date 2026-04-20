import Link from 'next/link';
import { urlFor } from '../sanity/lib/sanityImage';

const bunnyLibraryId =
  process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '';

type Props = {
  title: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thumbnail?: any; // Sanity image
  stream?: {
    playbackId?: string | null;
    thumbnailUrl?: string | null;
  } | null;
};

export default function VideoCard({ title, slug, thumbnail, stream }: Props) {
  const sanityUrl = thumbnail
    ? urlFor(thumbnail).width(640).height(360).fit("crop").url()
    : null;

  const bunnyStored = stream?.thumbnailUrl ?? null;

  const bunnyFallback = stream?.playbackId && bunnyLibraryId
    ? `https://vz-${bunnyLibraryId}-${stream.playbackId}.b-cdn.net/thumbnail.jpg`
    : null;

  const thumbUrl = sanityUrl || bunnyStored || bunnyFallback || null;

  return (
    <Link
      href={`/video/${slug}`}
      className="group block overflow-hidden rounded-xl border hover:shadow-lg transition"
    >
      <div className="aspect-video bg-gray-100">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400 text-sm">
            No thumbnail
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-base font-medium line-clamp-2">{title}</h3>
      </div>
    </Link>
  );
}
