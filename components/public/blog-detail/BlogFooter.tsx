"use client";

import { useState } from 'react';
import Link from 'next/link';
import { X, Share2, Link as LinkIcon } from 'lucide-react';

interface BlogFooterProps {
  post: {
    title: string;
    slug: string;
    tags?: string[];
  };
}

export default function BlogFooter({ post }: BlogFooterProps) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  };

  const handleShareTwitter = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = post.title || 'Check out this blog post';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleShareLinkedIn = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 border-t border-foreground/10">
      {/* Tags section */}
      {(post.tags || []).length > 0 && (
        <div className="mb-12">
          <h3 className="text-sm font-mono uppercase tracking-wider text-foreground/60 mb-4">
            TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            {(post.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-foreground/5 text-foreground/70 text-sm rounded-full border border-foreground/10 hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Share buttons */}
      <div className="mb-12">
        <h3 className="text-sm font-mono uppercase tracking-wider text-foreground/60 mb-4">
          SHARE
        </h3>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={handleShareTwitter}
            className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Share on Twitter"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleShareLinkedIn}
            className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Copy link"
          >
            <LinkIcon size={18} />
          </button>

          {/* Copied toast */}
          {showCopiedToast && (
            <div className="absolute left-36 bg-primary text-background px-4 py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-left-2">
              Copied!
            </div>
          )}
        </div>
      </div>

      {/* Author bio */}
      <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-xl flex-shrink-0">
            A
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold mb-2">
              Written by Aditya Jagtap
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed mb-4">
              Finance professional and strategy enthusiast exploring markets, consulting, and the intersection of technology and business.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Learn more about me
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
