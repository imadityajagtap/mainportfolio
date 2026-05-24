import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide';
}

/**
 * Container Component
 * Provides consistent max-width and padding across the site
 *
 * Variants:
 * - default: max-w-7xl (1280px)
 * - narrow: max-w-4xl (896px) - for blog posts, long-form content
 * - wide: max-w-screen-2xl (1536px) - for wide layouts
 */
export default function Container({
  children,
  className,
  variant = 'default',
}: ContainerProps) {
  const maxWidthClasses = {
    default: 'max-w-7xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-screen-2xl',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        maxWidthClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
