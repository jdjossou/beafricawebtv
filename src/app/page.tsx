import Image from 'next/image';
import Link from 'next/link';
import { getVideoThumbnailUrl } from '@/utils/videoThumbnails';
import { sanityClient } from '../sanity/lib/sanity';

type VideoSanityItem = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  thumbnail?: unknown;
  stream?: {
    playbackId?: string | null;
    thumbnailUrl?: string | null;
  } | null;
  publishedAt?: string;
};

type VideoPreview = VideoSanityItem & {
  thumbnailUrl: string | null;
};

const channelBrand = {
  name: 'Beafrica WebTV',
  heroImage: '/images/hero-banniere.jpg',
  channelAvatar: '/images/channel-avatar.jpg',
  youtubeChannelUrl: 'https://www.youtube.com/@BeAfricaWebTV',
  youtubeVideosUrl: 'https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ',
};

const editorialHighlights = [
  {
    icon: '🔍',
    title: 'Actualités politiques béninoises',
    description:
      'Décryptez les décisions gouvernementales, les débats parlementaires et les faits marquants qui redessinent le paysage politique au Bénin.',
  },
  {
    icon: '🌐',
    title: 'Démocratie & participation citoyenne',
    description:
      'Découvrez comment la société civile s’organise, comment les mouvements citoyens se mobilisent et comment la démocratie béninoise se vit sur le terrain.',
  },
  {
    icon: '👤',
    title: 'Gouvernance de Patrice Talon',
    description:
      'Analysez les réformes, les projets et les enjeux liés à la présidence de Patrice Talon pour mieux comprendre les orientations du pays.',
  },
];

const communityHighlights = [
  {
    heading: 'Suivez l’actualité politique béninoise',
    body:
      'Explorez l’univers dynamique de la politique béninoise : nous relayons les initiatives clés et les voix qui comptent pour la démocratie du pays.',
  },
  {
    heading: 'Vivez nos directs hebdomadaires',
    body:
      'Rendez-vous chaque dimanche sur Facebook Live pour des débats ouverts avec la communauté Beafrica.',
  },
  {
    heading: 'Rejoignez les discussions instantanées',
    body:
      'Notre chaîne WhatsApp centralise les briefings rapides, les rappels d’émissions et les liens vers les replays.',
  },
];

const membershipCta = {
  title: 'Devenez membre VIP',
  blurb:
    'Recevez nos vidéos en primeur, accédez aux discussions privées et soutenez l’équipe éditoriale qui couvre l’actualité quotidienne.',
  actionLabel: 'Adhérer sur YouTube',
  actionUrl: 'https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ/join',
};

const contactLinks = [
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UC9OsHbXIllgw0EV39Bp3ZxQ',
    description: 'Tous les replays, directs et publications exclusives.',
    icon: '/icons/youtube_icon.png',
    iconAlt: 'Logo YouTube',
  },
  {
    label: 'TikTok',
    url: 'https://bit.ly/3S9wp7G',
    description: 'Formats courts pour suivre l’actualité politique en mobilité.',
    icon: '/icons/tiktok_icon.png',
    iconAlt: 'Logo TikTok',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/beAfrica',
    description: 'Directs du dimanche et interactions en temps réel.',
    icon: '/icons/facebook_icon.png',
    iconAlt: 'Logo Facebook',
  },
  {
    label: 'WhatsApp',
    url: 'https://www.whatsapp.com/channel/0029VaePawS0bIdeip16xK0d',
    description: 'Alertes immédiates et conversation avec la communauté.',
    icon: '/icons/whatsapp_icon.png',
    iconAlt: 'Logo WhatsApp',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/beafrica_webtv',
    description: 'Coulisses des interviews et stories quotidiennes.',
    icon: '/icons/instagram_icon.png',
    iconAlt: 'Logo Instagram',
  },
];

const bunnyLibraryId =
  process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '';

const INITIAL_FETCH_LIMIT = 4;

export default async function Home() {
  const { videos: rawVideos, total } = await sanityClient.fetch<{
    videos: VideoSanityItem[];
    total: number;
  }>(
    `{
      "videos": *[_type == "video"] 
        | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...${INITIAL_FETCH_LIMIT}]{
          _id,
          title,
          slug,
          description,
          thumbnail,
          stream {
            playbackId,
            thumbnailUrl
          },
          publishedAt
        },
      "total": count(*[_type == "video"])
    }`
  );

  const videos: VideoPreview[] = rawVideos.map(video => ({
    ...video,
    thumbnailUrl: getVideoThumbnailUrl(video),
  }));

  const totalCount = total;
  const featuredVideo = videos[0] ?? null;
  const previewStart = featuredVideo ? 1 : 0;
  const previewVideos = videos.slice(previewStart, previewStart + 3);
  const hasMoreVideos = totalCount > previewStart + previewVideos.length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <section>
          <Image
            src={channelBrand.heroImage}
            alt="Bannière Beafrica WebTV"
            width={2276}
            height={377}
            className="w-full rounded-3xl border border-white/10 object-cover"
            priority
          />
        </section>

        <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-sm sm:flex-row sm:items-center sm:gap-8">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-slate-800 sm:h-32 sm:w-32">
            <Image
              src={channelBrand.channelAvatar}
              alt="Avatar Beafrica WebTV"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {channelBrand.name}
              </h1>
              <p className="text-lg text-slate-200 sm:text-xl">
                Explorez l’actualité politique béninoise, les engagements citoyens et la gouvernance du président Patrice Talon.
              </p>
              <p className="text-sm text-slate-300">
                Notre rédaction diffuse reportages, analyses et conversations pour informer la diaspora francophone et les publics locaux.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href={channelBrand.youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-2 font-medium text-white transition hover:bg-red-400"
              >
                Regarder sur YouTube
              </Link>
            </div>
          </div>
        </section>

        {featuredVideo ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Dernière vidéo</h2>
            </div>
            <Link
              href={`/video/${featuredVideo.slug.current}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:border-white/20 sm:flex-row"
            >
              <div className="w-full sm:w-[55%]">
                <div className="aspect-video w-full bg-slate-800">
                  {featuredVideo.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-300">
                      Ajoutez une miniature dans Sanity ou via Bunny Stream.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-6">
                <p className="text-xl font-semibold text-white line-clamp-2">
                  {featuredVideo.title}
                </p>
                <span className="text-sm text-slate-400">Regarder maintenant</span>
              </div>
            </Link>
          </section>
        ) : null}

        <section id="videos" className="space-y-6">
          {previewVideos.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {previewVideos.map(video => {
                  // getVideoThumbnailUrl already handles:
                  // - manual Sanity thumbnail
                  // - stream.thumbnailUrl
                  // - stream.playbackId fallback
                  const fallbackThumb =
                    video.thumbnailUrl ??
                    (video.stream?.playbackId && bunnyLibraryId
                      ? `https://vz-${bunnyLibraryId}-${video.stream.playbackId}.b-cdn.net/thumbnail.jpg`
                      : null);

                  return (
                    <Link
                      key={video._id}
                      href={`/video/${video.slug.current}`}
                      className="group block overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 hover:border-white/20 hover:shadow-lg transition"
                    >
                      <div className="aspect-video bg-slate-900">
                        {fallbackThumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={fallbackThumb}
                            alt={video.title}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-sm text-slate-300">
                            Miniature à venir
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-base font-medium text-white line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {hasMoreVideos ? (
                <div className="flex justify-center">
                  <Link
                    href="/videos"
                    className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
                  >
                    Voir toute la vidéothèque
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
              Aucune autre vidéo n&apos;est disponible pour le moment.
            </div>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {editorialHighlights.map(highlight => (
            <div
              key={highlight.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/20"
            >
              <div className="text-3xl" aria-hidden="true">
                {highlight.icon}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">
                {highlight.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{highlight.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {communityHighlights.map(item => (
            <div
              key={item.heading}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{item.heading}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-600/70 via-red-500/40 to-slate-900/80 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">{membershipCta.title}</h2>
              <p className="text-sm text-red-100/90 sm:text-base">{membershipCta.blurb}</p>
            </div>
            <Link
              href={membershipCta.actionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 font-medium text-red-600 transition hover:bg-red-100"
            >
              {membershipCta.actionLabel}
            </Link>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Communauté & contacts
            </h2>
            <p className="text-sm text-slate-300">
              Rejoignez Beafrica WebTV sur vos plateformes préférées pour recevoir les alertes, participer aux directs et échanger avec la rédaction.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {contactLinks.map(contact => (
              <Link
                key={contact.label}
                href={contact.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-white/20 hover:bg-slate-900/80"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
                  <Image
                    src={contact.icon}
                    alt={contact.iconAlt}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">{contact.label}</p>
                  <p className="text-sm text-slate-300">{contact.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
