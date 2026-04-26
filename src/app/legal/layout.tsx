import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="main-content">
      <div className="content-container py-10 sm:py-14">
        <article className="legal-prose mx-auto max-w-3xl">{children}</article>
      </div>
    </main>
  );
}
