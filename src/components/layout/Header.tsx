'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/videos', label: 'Vidéothèque' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't render header on Sanity Studio pages
  if (pathname?.startsWith('/studio')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="content-container flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/images/channel-avatar.jpg"
              alt="Beafrica WebTV"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
            Beafrica
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-primary)] lg:hidden"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="animate-slide-down border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl lg:hidden">
          <nav className="content-container flex flex-col gap-1 py-3" aria-label="Menu mobile">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
