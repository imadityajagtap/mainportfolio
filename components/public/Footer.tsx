"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Share2, X, Mail, ArrowUp, Heart } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

export default function Footer() {
  const { settings, isLoading } = useSettings();
  const handleBackToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative bg-foreground/[0.03] border-t border-foreground/10 mt-24"
    >
      {/* Decorative watermark */}
      <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-[20rem] font-serif font-bold text-foreground/[0.03] pointer-events-none select-none hidden md:block">
        AJ
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* TOP SECTION - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* COLUMN 1 - Brand (spans 2 on desktop) */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            {/* Logo */}
            <div className="text-4xl font-serif font-bold">
              {isLoading ? (
                <div className="w-16 h-12 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-primary">{(settings?.logoInitials || 'AJ')[0]}</span>
                  <span className="text-secondary">{(settings?.logoInitials || 'AJ')[1]}</span>
                </>
              )}
            </div>

            {/* Tagline */}
            {isLoading ? (
              <div className="w-64 h-6 bg-muted animate-pulse rounded mt-4" />
            ) : (
              <p className="text-foreground/70 italic mt-4 max-w-sm">
                {settings?.footerTagline || 'Finance meets strategy. Numbers meet stories.'}
              </p>
            )}

            {/* Location */}
            {isLoading ? (
              <div className="w-72 h-5 bg-muted animate-pulse rounded mt-6" />
            ) : (
              <div className="flex items-center gap-2 mt-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-foreground/60">
                  {settings?.footerLocation || 'Based in Mumbai · Open to opportunities worldwide'}
                </p>
              </div>
            )}

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                  ))}
                </>
              ) : (
                <>
                  {settings?.githubUrl && (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary hover:-translate-y-1 transition-all"
                      aria-label="GitHub"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                      </svg>
                    </a>
                  )}
                  {settings?.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary hover:-translate-y-1 transition-all"
                      aria-label="LinkedIn"
                    >
                      <Share2 size={18} />
                    </a>
                  )}
                  {settings?.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary hover:-translate-y-1 transition-all"
                      aria-label="Twitter"
                    >
                      <X size={18} />
                    </a>
                  )}
                  {settings?.contactEmail && (
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary hover:-translate-y-1 transition-all"
                      aria-label="Email"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* COLUMN 2 - Navigate */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-4">
              NAVIGATE
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/#about"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/#projects"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Projects
              </Link>
              <Link
                href="/#experience"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Experience
              </Link>
              <Link
                href="/blog"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Contact
              </Link>
            </nav>
          </motion.div>

          {/* COLUMN 3 - Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-4">
              RESOURCES
            </h3>
            <nav className="flex flex-col gap-3">
              {settings?.resumeUrl ? (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {settings.resumeLabel || 'Download Resume'}
                </a>
              ) : (
                <span className="text-foreground/40 text-sm cursor-not-allowed">
                  Resume Not Available
                </span>
              )}
              <Link
                href="/#research"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Research Papers
              </Link>
              <Link
                href="/#achievements"
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Achievements
              </Link>
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  LinkedIn Profile
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  Email Me
                </a>
              )}
            </nav>
          </motion.div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-foreground/10 my-8" />

        {/* BOTTOM SECTION */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center flex-col md:flex-row gap-4"
        >
          {/* Left - Copyright */}
          {isLoading ? (
            <div className="w-48 h-5 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-sm text-foreground/60">
              {settings?.copyrightText || '© 2026 Aditya Jagtap · All rights reserved'}
            </p>
          )}

          {/* Center - Built with */}
          <p className="text-sm text-foreground/60 flex items-center gap-2">
            Built with
            <Heart className="w-4 h-4 text-secondary fill-current animate-pulse" />
            using Next.js & Tailwind
          </p>

          {/* Right - Back to top */}
          <button
            onClick={handleBackToTop}
            className="group flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
          >
            Back to top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.footer>
  );
}
