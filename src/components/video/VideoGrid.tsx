import type { ReactNode } from 'react';

type VideoGridProps = {
  children: ReactNode;
  className?: string;
};

export default function VideoGrid({ children, className = '' }: VideoGridProps) {
  return (
    <div
      className={`stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}
