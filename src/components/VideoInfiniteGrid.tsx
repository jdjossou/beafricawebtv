'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import VideoCard from '@/components/video/VideoCard';
import VideoGrid from '@/components/video/VideoGrid';
import VideoCardSkeleton from '@/components/video/VideoCardSkeleton';

type VideoPreview = {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnailUrl: string | null;
  description?: string;
  stream?: {
    playbackId?: string | null;
    thumbnailUrl?: string | null;
  } | null;
  publishedAt?: string;
};

type VideoInfiniteGridProps = {
  initialVideos: VideoPreview[];
  initialOffset: number;
  totalCount: number;
  pageSize?: number;
  autoLoadOnMount?: boolean;
  showManualTrigger?: boolean;
  searchQuery?: string;
};

const DEFAULT_PAGE_SIZE = 12;

export default function VideoInfiniteGrid({
  initialVideos,
  initialOffset,
  totalCount,
  pageSize = DEFAULT_PAGE_SIZE,
  autoLoadOnMount = false,
  showManualTrigger = true,
  searchQuery,
}: VideoInfiniteGridProps) {
  const [videos, setVideos] = useState<VideoPreview[]>(initialVideos);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(autoLoadOnMount);
  const [hasMore, setHasMore] = useState(initialOffset < totalCount);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      let url = `/api/videos?offset=${offset}&limit=${pageSize}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Impossible de charger plus de vidéos pour le moment.');
      }

      const data: {
        videos: VideoPreview[];
        totalCount: number;
        hasMore: boolean;
      } = await response.json();

      if (Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v._id));
          const merged = data.videos.filter((v) => !existingIds.has(v._id));
          return [...prev, ...merged];
        });
        setOffset((prev) => prev + data.videos.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, offset, pageSize, searchQuery]);

  useEffect(() => {
    if (autoLoadOnMount) setAutoLoadEnabled(true);
  }, [autoLoadOnMount]);

  useEffect(() => {
    if (!autoLoadEnabled || !hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [autoLoadEnabled, hasMore, loadMore]);

  const handleEnableAutoLoad = () => {
    if (!autoLoadEnabled) setAutoLoadEnabled(true);
    void loadMore();
  };

  if (totalCount === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center text-sm text-[var(--text-muted)]">
        {searchQuery
          ? `Aucun résultat pour "${searchQuery}".`
          : "Aucune vidéo n\u2019est encore publiée."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

        {/* Skeleton loaders while fetching */}
        {loading &&
          Array.from({ length: Math.min(pageSize, 4) }).map((_, i) => (
            <VideoCardSkeleton key={`skeleton-${i}`} />
          ))}
      </VideoGrid>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/5 p-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {hasMore && showManualTrigger && !autoLoadEnabled && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleEnableAutoLoad}
            disabled={loading}
            className="rounded-full border border-[var(--border)] bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-hover)] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Chargement…' : 'Charger plus de vidéos'}
          </button>
        </div>
      )}

      {autoLoadEnabled && hasMore && (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      )}
    </div>
  );
}
