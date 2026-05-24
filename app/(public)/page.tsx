import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import ExperienceSection from '@/components/public/ExperienceSection';
import ResearchSection from '@/components/public/ResearchSection';
import AchievementsSection from '@/components/public/AchievementsSection';
import BlogSection from '@/components/public/BlogSection';
import ContactSection from '@/components/public/ContactSection';

/**
 * Home Page - Portfolio Landing
 * Features Hero section with greeting, profile, CTAs, and animated doodles
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills />

      {/* Projects Section */}
      <Projects />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Research Section */}
      <ResearchSection />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
