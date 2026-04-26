import Link from 'next/link';
import Image from 'next/image';

const socials = [
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ',
    description: 'Replays et directs',
    icon: '/icons/youtube_icon.png',
  },
  {
    label: 'TikTok',
    url: 'https://bit.ly/3S9wp7G',
    description: 'Formats courts',
    icon: '/icons/tiktok_icon.png',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/beAfrica',
    description: 'Directs du dimanche',
    icon: '/icons/facebook_icon.png',
  },
  {
    label: 'WhatsApp',
    url: 'https://www.whatsapp.com/channel/0029VaePawS0bIdeip16xK0d',
    description: 'Alertes instantanées',
    icon: '/icons/whatsapp_icon.png',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/beafrica_webtv',
    description: 'Coulisses et stories',
    icon: '/icons/instagram_icon.png',
  },
];

export default function SocialStrip() {
  return (
    <section className="animate-fade-in space-y-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        Rejoignez la communauté
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {socials.map((social) => (
          <Link
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="glass-card flex items-center gap-3 px-4 py-3.5 transition-all hover:border-[var(--border-hover)] hover:bg-white/[0.02]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.08]">
              <Image
                src={social.icon}
                alt={social.label}
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {social.label}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {social.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
