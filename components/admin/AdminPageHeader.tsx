"use client";

import Link from 'next/link';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export default function AdminPageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionHref,
}: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-foreground/60 mt-1">{subtitle}</p>}
      </div>

      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium"
            >
              <Plus size={18} />
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium"
            >
              <Plus size={18} />
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
