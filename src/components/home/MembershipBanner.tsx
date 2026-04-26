import Link from 'next/link';

export default function MembershipBanner() {
  return (
    <section className="animate-fade-in overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-accent)] bg-gradient-to-r from-[var(--accent)]/15 via-[var(--accent)]/5 to-transparent p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
            Devenez membre VIP
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
            Recevez nos vidéos en primeur, accédez aux discussions privées et soutenez
            l&apos;équipe éditoriale qui couvre l&apos;actualité quotidienne.
          </p>
        </div>
        <Link
          href="https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ/join"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20 transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--accent)]/30"
        >
          Adhérer sur YouTube
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
