'use client';

import { useState, useEffect } from 'react';
import { Download, FileX } from 'lucide-react';

interface ResumeButtonProps {
  variant?: 'desktop' | 'mobile';
}

export default function ResumeButton({ variant = 'desktop' }: ResumeButtonProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setResumeUrl(data.data?.resumeUrl || null);
        }
      } catch (error) {
        console.error('Failed to fetch resume URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeUrl();
  }, []);

  const handleClick = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isLoading}
          aria-label={!resumeUrl ? 'Resume not uploaded' : 'Download resume'}
          className="w-full bg-primary text-white rounded-lg px-5 py-3 text-base font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resumeUrl ? (
            <>
              <Download className="w-5 h-5" />
              {isLoading ? 'Loading...' : 'Download Resume'}
            </>
          ) : (
            <>
              <FileX className="w-5 h-5" />
              {isLoading ? 'Loading...' : 'Resume Not Available'}
            </>
          )}
        </button>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 bg-foreground text-background rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-medium">No resume available at the moment</p>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        data-cursor="hover"
        aria-label={!resumeUrl ? 'Resume not uploaded' : 'Download resume'}
        title={!resumeUrl ? 'Resume not uploaded' : 'Download resume'}
        className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resumeUrl ? (
          <>
            <Download className="w-4 h-4" />
            Resume
          </>
        ) : (
          <>
            <FileX className="w-4 h-4" />
            Resume
          </>
        )}
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 bg-foreground text-background rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm font-medium">No resume available at the moment</p>
        </div>
      )}
    </>
  );
}
