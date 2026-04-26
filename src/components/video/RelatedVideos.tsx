import { sanityClient } from '@/sanity/lib/sanity';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';
import type { VideoSanityItem, VideoPreview } from '@/types/video';
import VideoCard from './VideoCard';
import VideoGrid from './VideoGrid';

type RelatedVideosProps = {
  excludeSlug: string;
  count?: number;
};

export default async function RelatedVideos({
  excludeSlug,
  count = 4,
}: RelatedVideosProps) {
  const rawVideos = await sanityClient.fetch<VideoSanityItem[]>(
    `*[_type == "video" && slug.current != $slug]
      | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...$count]{
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
      }`,
    { slug: excludeSlug, count }
  );

  const videos: VideoPreview[] = rawVideos.map((video) => ({
    ...video,
    thumbnailUrl: getVideoThumbnailUrl(video),
  }));

  if (videos.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        À regarder ensuite
      </h2>
      <VideoGrid>
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            slug={video.slug.current}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            publishedAt={video.publishedAt}
          />
        ))}
      </VideoGrid>
    </section>
  );
}
