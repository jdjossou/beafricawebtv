'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlaySquare } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/videos', label: 'Vidéothèque', icon: PlaySquare },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Don't render on Sanity Studio pages
  if (pathname?.startsWith('/studio')) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl lg:hidden"
      aria-label="Navigation mobile"
    >
      <div className="flex h-[var(--mobile-nav-height)] items-stretch">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
