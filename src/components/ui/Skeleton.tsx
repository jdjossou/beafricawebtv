type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-skeleton rounded-md bg-white/[0.06] ${className}`}
      aria-hidden="true"
    />
  );
}
