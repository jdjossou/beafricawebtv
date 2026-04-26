import VideoInfiniteGrid from '@/components/VideoInfiniteGrid';
import { sanityClient } from '@/sanity/lib/sanity';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';
import type { VideoSanityItem, VideoPreview } from '@/types/video';

const INITIAL_PAGE_SIZE = 12;

export const metadata = {
  title: 'Vidéothèque',
  description:
    'Découvrez l\'ensemble des vidéos de Beafrica WebTV et parcourez-les librement.',
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VideosPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawQuery = resolvedSearchParams?.q;
  const searchQuery = typeof rawQuery === 'string' ? rawQuery.trim() : '';

  // Build GROQ filter
  const searchFilter = searchQuery
    ? ` && (title match "*${searchQuery.replace(/"/g, '')}*" || count(tags[@ match "*${searchQuery.replace(/"/g, '')}*"]) > 0)`
    : '';

  const { videos: rawVideos, total } = await sanityClient.fetch<{
    videos: VideoSanityItem[];
    total: number;
  }>(
    `{
      "videos": *[_type == "video"${searchFilter}] 
        | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...${INITIAL_PAGE_SIZE}]{
          _id,
          title,
          slug,
          description,
          tags,
          thumbnail,
          stream {
            playbackId,
            thumbnailUrl
          },
          publishedAt
        },
      "total": count(*[_type == "video"${searchFilter}])
    }`
  );

  const initialVideos: VideoPreview[] = rawVideos.map((video) => ({
    ...video,
    thumbnailUrl: getVideoThumbnailUrl(video),
  }));

  const initialOffset = Math.min(total, initialVideos.length);

  return (
    <main className="main-content">
      <div className="content-container flex flex-col gap-6 py-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Vidéothèque'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery
              ? `${total} vidéo${total !== 1 ? 's' : ''} trouvée${total !== 1 ? 's' : ''}`
              : 'Retrouvez l\'ensemble de nos émissions, replays et exclusivités.'}
          </p>
        </header>

        <VideoInfiniteGrid
          initialVideos={initialVideos}
          initialOffset={initialOffset}
          totalCount={total}
          pageSize={INITIAL_PAGE_SIZE}
          autoLoadOnMount
          showManualTrigger={false}
          searchQuery={searchQuery || undefined}
        />
      </div>
    </main>
  );
}
