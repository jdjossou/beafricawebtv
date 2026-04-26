'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const socialLinks = [
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ',
    icon: '/icons/youtube_icon.png',
  },
  {
    label: 'TikTok',
    url: 'https://bit.ly/3S9wp7G',
    icon: '/icons/tiktok_icon.png',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/Onsedittouttv/',
    icon: '/icons/facebook_icon.png',
  },
  {
    label: 'WhatsApp',
    url: 'https://www.whatsapp.com/channel/0029VaePawS0bIdeip16xK0d',
    icon: '/icons/whatsapp_icon.png',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/beafrica_webtv',
    icon: '/icons/instagram_icon.png',
  },
];

export default function Footer() {
  const pathname = usePathname();

  // Don't render footer on Sanity Studio pages
  if (pathname?.startsWith('/studio')) return null;

  return (
    <footer className="hidden border-t border-[var(--border)] bg-[var(--bg-surface)]/50 lg:block">
      <div className="content-container py-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/images/channel-avatar.jpg"
                  alt="Beafrica WebTV"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-base font-semibold tracking-tight">
                Beafrica WebTV
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Couverture de l&apos;actualité politique béninoise, débats en direct et échanges avec la diaspora francophone.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Accueil
              </Link>
              <Link
                href="/videos"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Vidéothèque
              </Link>
            </nav>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Communauté
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/[0.06] transition-colors hover:bg-white/[0.12]"
                  aria-label={social.label}
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Beafrica WebTV. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
