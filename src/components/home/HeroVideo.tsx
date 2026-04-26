import VideoCard from '@/components/video/VideoCard';
import type { VideoPreview } from '@/types/video';

type HeroVideoProps = {
  video: VideoPreview;
};

export default function HeroVideo({ video }: HeroVideoProps) {
  return (
    <section className="animate-fade-in">
      <VideoCard
        slug={video.slug.current}
        title={video.title}
        thumbnailUrl={video.thumbnailUrl}
        publishedAt={video.publishedAt}
        size="large"
      />
    </section>
  );
}
