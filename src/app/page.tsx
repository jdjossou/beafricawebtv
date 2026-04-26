import Link from 'next/link';
import { sanityClient } from '../sanity/lib/sanity';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';
import type { VideoSanityItem, VideoPreview } from '@/types/video';
import HeroVideo from '@/components/home/HeroVideo';
import VideoCard from '@/components/video/VideoCard';
import VideoGrid from '@/components/video/VideoGrid';
import MembershipBanner from '@/components/home/MembershipBanner';
import SocialStrip from '@/components/home/SocialStrip';

const FETCH_LIMIT = 9; // 1 hero + 8 grid

export default async function Home() {
  const { videos: rawVideos, total } = await sanityClient.fetch<{
    videos: VideoSanityItem[];
    total: number;
  }>(
    `{
      "videos": *[_type == "video"] 
        | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...${FETCH_LIMIT}]{
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
      "total": count(*[_type == "video"])
    }`
  );

  const videos: VideoPreview[] = rawVideos.map((video) => ({
    ...video,
    thumbnailUrl: getVideoThumbnailUrl(video),
  }));

  const featuredVideo = videos[0] ?? null;
  const gridVideos = videos.slice(1, 9);
  const hasMoreVideos = total > FETCH_LIMIT;

  return (
    <main className="main-content">
      <div className="content-container flex flex-col gap-10 py-8">
        {/* Hero: Featured Video */}
        {featuredVideo && <HeroVideo video={featuredVideo} />}

        {/* Recent Videos Grid */}
        {gridVideos.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Vidéos récentes
              </h2>
              {hasMoreVideos && (
                <Link
                  href="/videos"
                  className="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  Voir tout →
                </Link>
              )}
            </div>
            <VideoGrid>
              {gridVideos.map((video) => (
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
        )}

        {/* Empty state */}
        {videos.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center text-sm text-[var(--text-muted)]">
            Aucune vidéo n&apos;est disponible pour le moment.
          </div>
        )}

        {/* Membership CTA */}
        <MembershipBanner />

        {/* Social Links */}
        <SocialStrip />
      </div>
    </main>
  );
}
