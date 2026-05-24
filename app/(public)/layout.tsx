import { ReactNode } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import BackToTopButton from '@/components/public/BackToTopButton';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Public Site Layout
 * Wraps all public-facing pages with navbar and footer
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackToTopButton />
    </>
  );
}
