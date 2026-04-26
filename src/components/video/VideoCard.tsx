import Link from 'next/link';

type VideoCardProps = {
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  publishedAt?: string;
  size?: 'default' | 'large';
};

export default function VideoCard({
  slug,
  title,
  thumbnailUrl,
  publishedAt,
  size = 'default',
}: VideoCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const isLarge = size === 'large';

  return (
    <Link
      href={`/video/${slug}`}
      className={`glass-card glass-card-interactive group block overflow-hidden ${
        isLarge ? 'sm:flex sm:flex-row' : ''
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden bg-[var(--bg-elevated)] ${
          isLarge ? 'aspect-video sm:w-[60%]' : 'aspect-video'
        }`}
      >
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading={isLarge ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        className={`flex flex-col gap-1.5 ${
          isLarge ? 'justify-center p-5 sm:p-8' : 'p-3.5'
        }`}
      >
        <h3
          className={`font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 ${
            isLarge ? 'text-lg sm:text-xl' : 'text-sm'
          }`}
        >
          {title}
        </h3>
        {formattedDate && (
          <span
            className={`text-[var(--text-muted)] ${
              isLarge ? 'text-sm' : 'text-xs'
            }`}
          >
            {formattedDate}
          </span>
        )}
        {isLarge && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent-hover)]">
            Regarder maintenant
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  );
}
