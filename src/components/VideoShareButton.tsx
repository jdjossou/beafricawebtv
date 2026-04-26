'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link2, Share2 } from 'lucide-react';

type VideoShareButtonProps = {
  title: string;
  description?: string | null;
  path?: string;
};

export default function VideoShareButton({
  title,
  description,
  path,
}: VideoShareButtonProps) {
  const pathname = usePathname();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);

  const sharePath = useMemo(() => {
    const p = path ?? pathname;
    if (!p) return null;
    if (p.startsWith('http')) return p;
    return p.startsWith('/') ? p : `/${p}`;
  }, [path, pathname]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setNativeShareAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const getShareUrl = useCallback(() => {
    if (!sharePath) return typeof window !== 'undefined' ? window.location.href : null;
    if (sharePath.startsWith('http')) return sharePath;
    if (typeof window === 'undefined') return null;
    return `${window.location.origin}${sharePath}`;
  }, [sharePath]);

  const handleCopy = useCallback(async () => {
    const url = getShareUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setFeedback('Lien copié !');
    } catch {
      setFeedback('Impossible de copier.');
    }
  }, [getShareUrl]);

  const handleNativeShare = useCallback(async () => {
    const url = getShareUrl();
    if (!url) return;

    try {
      await navigator.share({
        title,
        text: description?.slice(0, 160) ?? title,
        url,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setFeedback('Partage indisponible.');
    }
  }, [getShareUrl, title, description]);

  return (
    <div className="flex items-center gap-2">
      {nativeShareAvailable && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-hover)] hover:bg-white/[0.08]"
          aria-label="Partager la vidéo"
        >
          <Share2 size={15} />
          <span>Partager</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-hover)] hover:bg-white/[0.08]"
        aria-label="Copier le lien"
      >
        <Link2 size={15} />
        <span>Copier le lien</span>
      </button>

      {feedback && (
        <span className="animate-fade-in text-xs font-medium text-emerald-400">
          {feedback}
        </span>
      )}
    </div>
  );
}
