import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section Component
 * Wrapper for page sections with consistent vertical spacing
 */
export default function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24 lg:py-32', className)}>
      {children}
    </section>
  );
}
