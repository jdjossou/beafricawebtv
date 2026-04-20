'use client';

import { bunnyEmbedUrl } from '@/lib/bunny';

type Props = {
  playbackId?: string | null;
};

export default function VideoPlayer({ playbackId }: Props) {
  if (!playbackId) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-slate-900/50 grid place-items-center text-slate-400">
        Vidéo en cours de préparation…
      </div>
    );
  }

  const embedUrl = bunnyEmbedUrl(playbackId);

  if (!embedUrl) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-slate-900/50 grid place-items-center text-slate-400">
        Configurez NEXT_PUBLIC_BUNNY_LIBRARY_ID pour lire la vidéo.
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-2xl shadow">
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-2xl"
        loading="lazy"
        title="Video player"
      />
    </div>
  );
}
