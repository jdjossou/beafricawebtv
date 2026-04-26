'use client';

import { bunnyEmbedUrl } from '@/lib/bunny';

type Props = {
  playbackId?: string | null;
};

export default function VideoPlayer({ playbackId }: Props) {
  if (!playbackId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-lg)] bg-[var(--bg-surface)] text-sm text-[var(--text-muted)]">
        <div className="text-center space-y-2">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-40">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
          <p>Vidéo en cours de préparation…</p>
        </div>
      </div>
    );
  }

  const embedUrl = bunnyEmbedUrl(playbackId);

  if (!embedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-lg)] bg-[var(--bg-surface)] text-sm text-[var(--text-muted)]">
        <p>Configurez NEXT_PUBLIC_BUNNY_LIBRARY_ID pour lire la vidéo.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl">
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
        title="Lecteur vidéo"
      />
    </div>
  );
}
