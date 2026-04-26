'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

type SearchResult = {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnailUrl: string | null;
};

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?q=${encodeURIComponent(q.trim())}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.videos ?? []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/videos?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }, [pathname]);

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/[0.04] px-3 py-1.5 transition-colors focus-within:border-[var(--border-hover)] focus-within:bg-white/[0.06]">
          <Search size={16} className="shrink-0 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Rechercher…"
            className="w-28 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none sm:w-48"
            aria-label="Rechercher des vidéos"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              aria-label="Effacer la recherche"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && query.trim() && (
        <div className="animate-slide-down absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/95 shadow-2xl backdrop-blur-xl sm:w-96">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              Recherche en cours…
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((video) => (
                <Link
                  key={video._id}
                  href={`/video/${video.slug.current}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="h-12 w-20 shrink-0 overflow-hidden rounded-md bg-[var(--bg-elevated)]">
                    {video.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                        ▶
                      </div>
                    )}
                  </div>
                  <span className="line-clamp-2 text-sm font-medium text-[var(--text-primary)]">
                    {video.title}
                  </span>
                </Link>
              ))}
              <div className="border-t border-[var(--border)] px-4 py-2">
                <button
                  type="button"
                  onClick={handleSubmit as () => void}
                  className="text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  Voir tous les résultats →
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              Aucun résultat pour &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
