import Skeleton from '@/components/ui/Skeleton';

type VideoCardSkeletonProps = {
  size?: 'default' | 'large';
};

export default function VideoCardSkeleton({ size = 'default' }: VideoCardSkeletonProps) {
  const isLarge = size === 'large';

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] ${
        isLarge ? 'sm:flex sm:flex-row' : ''
      }`}
      aria-hidden="true"
    >
      <Skeleton
        className={`!rounded-none ${
          isLarge ? 'aspect-video sm:w-[60%]' : 'aspect-video w-full'
        }`}
      />
      <div
        className={`flex flex-col gap-2 ${
          isLarge ? 'justify-center p-5 sm:flex-1 sm:p-8' : 'p-3.5'
        }`}
      >
        <Skeleton className={`h-4 w-[85%] ${isLarge ? 'sm:h-5' : ''}`} />
        <Skeleton className={`h-4 w-[60%] ${isLarge ? 'sm:h-5' : ''}`} />
        {isLarge && <Skeleton className="mt-1 h-3 w-[30%]" />}
        {!isLarge && <Skeleton className="h-3 w-[35%]" />}
      </div>
    </div>
  );
}
