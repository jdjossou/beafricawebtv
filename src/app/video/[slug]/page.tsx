import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { sanityClient } from '../../../sanity/lib/sanity';
import VideoPlayer from '@/components/VideoPlayer';
import VideoShareButton from '@/components/VideoShareButton';
import RelatedVideos from '@/components/video/RelatedVideos';
import VideoCardSkeleton from '@/components/video/VideoCardSkeleton';
import VideoGrid from '@/components/video/VideoGrid';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';

const FALLBACK_OPENGRAPH_IMAGE = '/images/channel-avatar.jpg';

type HeaderList = Awaited<ReturnType<typeof headers>>;

type VideoDoc = {
  title: string;
  description?: string;
  tags?: string[];
  publishedAt?: string;
  thumbnail?: unknown;
  stream?: {
    playbackId?: string | null;
    uid?: string | null;
    duration?: number | null;
    thumbnailUrl?: string | null;
  } | null;
};

async function getVideo(slug: string) {
  const query = `*[_type == "video" && slug.current == $slug][0]{
    title,
    description,
    tags,
    publishedAt,
    thumbnail,
    stream {
      playbackId,
      uid,
      duration,
      thumbnailUrl
    }
  }`;
  return sanityClient.fetch<VideoDoc | null>(query, { slug });
}

function resolveBaseUrl(headerList: HeaderList): string | null {
  const forwardedProto = headerList.get('x-forwarded-proto');
  const proto = forwardedProto?.split(',')[0]?.trim() ?? 'https';
  const host =
    headerList.get('x-forwarded-host') ??
    headerList.get('host') ??
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!host) return null;

  const normalizedHost = host.startsWith('http') ? host : `${proto}://${host}`;
  try {
    const url = new URL(normalizedHost);
    return url.origin;
  } catch {
    return null;
  }
}

function resolveOgImageUrl(
  video: VideoDoc,
  headerList: HeaderList,
): string | null {
  const directThumbnail = getVideoThumbnailUrl(video);
  if (directThumbnail) return directThumbnail;

  const baseUrl = resolveBaseUrl(headerList);
  if (!baseUrl) return null;

  return new URL(FALLBACK_OPENGRAPH_IMAGE, baseUrl).toString();
}

function resolveCanonicalUrl(
  slug: string,
  headerList: HeaderList,
): string | null {
  const baseUrl = resolveBaseUrl(headerList);
  if (!baseUrl) return null;

  return new URL(`/video/${slug}`, baseUrl).toString();
}

export async function generateMetadata(
  { params }: Pick<PageProps, 'params'>,
): Promise<Metadata> {
  const resolvedParams = params ? await params : undefined;
  const slug = resolvedParams?.slug;
  if (!slug) return { title: 'Video not found' };

  const headerList = await headers();

  const video = await getVideo(slug);
  if (!video) return { title: 'Video not found' };

  const title = video.title;
  const description =
    (video.description && video.description.slice(0, 160)) ||
    'Watch this video';
  const ogImageUrl = resolveOgImageUrl(video, headerList);
  const canonicalUrl = resolveCanonicalUrl(slug, headerList);

  return {
    title,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'video.other',
      url: canonicalUrl ?? undefined,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1280,
              height: 720,
              alt: `${title} - Beafrica WebTV`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

type PageProps = {
  params?: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = params ? await params : undefined;
  const slug = resolvedParams?.slug;
  if (!slug) return notFound();

  const video = await getVideo(slug);
  if (!video) return notFound();

  const date = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : undefined;

  const playbackId = video.stream?.playbackId ?? null;

  return (
    <main className="main-content">
      <div className="content-container py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Player */}
          {playbackId ? (
            <VideoPlayer playbackId={playbackId} />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-lg)] bg-[var(--bg-surface)] text-sm text-[var(--text-muted)]">
              <p>Aucun identifiant de lecture disponible. Ajoutez-en un dans le Studio.</p>
            </div>
          )}

          {/* Title + Meta */}
          <div className="space-y-3">
            <h1 className="text-xl font-semibold leading-tight text-[var(--text-primary)] sm:text-2xl">
              {video.title}
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {date && (
                <span className="text-sm text-[var(--text-muted)]">{date}</span>
              )}
              <VideoShareButton
                title={video.title}
                description={video.description}
                path={`/video/${slug}`}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)]" />

          {/* Description */}
          {video.description && (
            <section className="max-w-3xl">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--text-secondary)]">
                {video.description}
              </p>
            </section>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/videos?q=${encodeURIComponent(tag)}`}
                  className="video-tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[var(--border)]" />

          {/* Related Videos */}
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="h-5 w-48 animate-skeleton rounded bg-white/[0.06]" />
                <VideoGrid>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <VideoCardSkeleton key={i} />
                  ))}
                </VideoGrid>
              </div>
            }
          >
            <RelatedVideos excludeSlug={slug} count={4} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
