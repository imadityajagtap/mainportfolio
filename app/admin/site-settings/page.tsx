"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDown, Save, Check } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiErrorMessage, readApiJson } from '@/lib/api-client';

interface SettingsFormData {
  // HERO
  heroGreeting: string;
  heroName: string;
  heroTagline: string;
  heroSubtitle: string;
  heroLabel: string;
  heroPhoto: string;
  tickerText: string;

  // CONTACT
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  contactHeading: string;
  contactSubtitle: string;
  contactResponseTime: string;

  // SOCIAL
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  instagramUrl: string;

  // FOOTER
  footerTagline: string;
  footerLocation: string;
  copyrightText: string;
  logoInitials: string;

  // SECTION HEADINGS
  projectsLabel: string;
  projectsHeading: string;
  projectsSubtitle: string;
  experienceLabel: string;
  experienceHeading: string;
  experienceSubtitle: string;
  researchLabel: string;
  researchHeading: string;
  researchSubtitle: string;

  // SEO
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
}

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<SettingsFormData>();
  const heroPhoto = watch('heroPhoto') || '';
  const ogImage = watch('ogImage') || '';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/site-settings', { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const settings = data.data;

        if (settings) {
          // HERO
          setValue('heroGreeting', settings.heroGreeting || '');
          setValue('heroName', settings.heroName || '');
          setValue('heroTagline', settings.heroTagline || '');
          setValue('heroSubtitle', settings.heroSubtitle || '');
          setValue('heroLabel', settings.heroLabel || '');
          setValue('heroPhoto', settings.heroPhoto || '');
          setValue('tickerText', Array.isArray(settings.tickerText) ? settings.tickerText.join(', ') : '');

          // CONTACT
          setValue('contactEmail', settings.contactEmail || '');
          setValue('contactPhone', settings.contactPhone || '');
          setValue('contactLocation', settings.contactLocation || '');
          setValue('contactHeading', settings.contactHeading || '');
          setValue('contactSubtitle', settings.contactSubtitle || '');
          setValue('contactResponseTime', settings.contactResponseTime || '');

          // SOCIAL
          setValue('linkedinUrl', settings.linkedinUrl || '');
          setValue('githubUrl', settings.githubUrl || '');
          setValue('twitterUrl', settings.twitterUrl || '');
          setValue('instagramUrl', settings.instagramUrl || '');

          // FOOTER
          setValue('footerTagline', settings.footerTagline || '');
          setValue('footerLocation', settings.footerLocation || '');
          setValue('copyrightText', settings.copyrightText || '');
          setValue('logoInitials', settings.logoInitials || '');

          // SECTION HEADINGS
          setValue('projectsLabel', settings.projectsLabel || '');
          setValue('projectsHeading', settings.projectsHeading || '');
          setValue('projectsSubtitle', settings.projectsSubtitle || '');
          setValue('experienceLabel', settings.experienceLabel || '');
          setValue('experienceHeading', settings.experienceHeading || '');
          setValue('experienceSubtitle', settings.experienceSubtitle || '');
          setValue('researchLabel', settings.researchLabel || '');
          setValue('researchHeading', settings.researchHeading || '');
          setValue('researchSubtitle', settings.researchSubtitle || '');

          // SEO
          setValue('siteTitle', settings.siteTitle || '');
          setValue('siteDescription', settings.siteDescription || '');
          setValue('ogImage', settings.ogImage || '');
        }
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      if (error.name === 'AbortError') {
        console.warn('⚠️ Site settings fetch timed out - check MongoDB Atlas IP whitelist');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const payload = {
        ...data,
        tickerText: typeof data.tickerText === 'string'
          ? data.tickerText.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };

      const response = await fetch('/api/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const jsonData = await readApiJson(response);

      if (!response.ok) {
        alert(`Failed to update: ${getApiErrorMessage(jsonData, response.statusText)}`);
        return;
      }

      // Dispatch event to notify public site to refetch settings
      window.dispatchEvent(new CustomEvent('settings-updated'));

      setSaveSuccess('Settings saved! Public site will reflect changes.');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ id, title, emoji }: { id: string; title: string; emoji: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-foreground/[0.02] hover:bg-foreground/[0.05] border border-foreground/10 rounded-xl transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <h3 className="text-lg font-serif font-bold text-foreground">{title}</h3>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-foreground/60 transition-transform ${
          expandedSection === id ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  const InputField = ({ label, name, placeholder, type = 'text', rows }: any) => (
    <div className="mb-4">
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
      {type === 'textarea' ? (
        <textarea
          {...register(name)}
          rows={rows || 3}
          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder={placeholder}
        />
      ) : (
        <input
          {...register(name)}
          type={type}
          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Site Settings</h1>
        <p className="text-foreground/60 mt-1">Configure all public-facing content from one place</p>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-primary mb-6">
          <Check className="w-5 h-5" />
          <span className="font-medium">{saveSuccess}</span>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <div>
        <SectionHeader id="hero" title="Hero Section" emoji="👋" />
        {expandedSection === 'hero' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-4">
            <InputField label="Greeting" name="heroGreeting" placeholder="Hi, I'm Aditya 👋" />
            <InputField label="Your Name" name="heroName" placeholder="Aditya Jagtap" />
            <InputField label="Tagline" name="heroTagline" placeholder="Decoding business, one framework at a time." />
            <InputField label="Subtitle" name="heroSubtitle" type="textarea" rows={2} placeholder="MBA student exploring..." />
            <InputField label="Label" name="heroLabel" placeholder="MBA Candidate · Finance × Strategy" />
            <input type="hidden" {...register('heroPhoto')} />
            <ImageUploader
              label="Photo"
              value={heroPhoto}
              onChange={(url) => setValue('heroPhoto', url as string, { shouldDirty: true })}
            />
            <InputField label="Stock Ticker (comma-separated)" name="tickerText" placeholder="AAPL +2.3%, TSLA -1.2%, ADITYA +∞%" />
          </div>
        )}
      </div>

      {/* SECTION 2: CONTACT */}
      <div>
        <SectionHeader id="contact" title="Contact Info" emoji="📧" />
        {expandedSection === 'contact' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-4">
            <InputField label="Email" name="contactEmail" type="email" placeholder="aditya@example.com" />
            <InputField label="Phone" name="contactPhone" placeholder="+91 XXXXX XXXXX" />
            <InputField label="Location" name="contactLocation" placeholder="Mumbai, India" />
            <InputField label="Section Heading" name="contactHeading" placeholder="Let's build something remarkable" />
            <InputField label="Section Subtitle" name="contactSubtitle" type="textarea" placeholder="Whether you're a recruiter..." />
            <InputField label="Response Time" name="contactResponseTime" placeholder="Usually responds within 24 hours" />
          </div>
        )}
      </div>

      {/* SECTION 3: SOCIAL LINKS */}
      <div>
        <SectionHeader id="social" title="Social Links" emoji="🔗" />
        {expandedSection === 'social' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-4">
            <InputField label="LinkedIn URL" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." />
            <InputField label="GitHub URL" name="githubUrl" type="url" placeholder="https://github.com/..." />
            <InputField label="Twitter URL" name="twitterUrl" type="url" placeholder="https://twitter.com/..." />
            <InputField label="Instagram URL" name="instagramUrl" type="url" placeholder="https://instagram.com/..." />
          </div>
        )}
      </div>

      {/* SECTION 4: FOOTER */}
      <div>
        <SectionHeader id="footer" title="Footer" emoji="🦶" />
        {expandedSection === 'footer' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-4">
            <InputField label="Tagline" name="footerTagline" placeholder="Finance meets strategy. Numbers meet stories." />
            <InputField label="Location Text" name="footerLocation" placeholder="Based in Mumbai · Open to opportunities worldwide" />
            <InputField label="Copyright" name="copyrightText" placeholder="© 2026 Aditya Jagtap · All rights reserved" />
            <InputField label="Logo Initials" name="logoInitials" placeholder="AJ" />
          </div>
        )}
      </div>

      {/* SECTION 5: SECTION HEADINGS */}
      <div>
        <SectionHeader id="sections" title="Section Headings" emoji="📑" />
        {expandedSection === 'sections' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-6">
            <div className="border-b border-foreground/10 pb-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Projects Section</h4>
              <InputField label="Label" name="projectsLabel" placeholder="04 / SELECTED WORK" />
              <InputField label="Heading" name="projectsHeading" placeholder="Projects that tell a story" />
              <InputField label="Subtitle" name="projectsSubtitle" placeholder="Real problems. Real analysis. Real impact." />
            </div>

            <div className="border-b border-foreground/10 pb-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Experience Section</h4>
              <InputField label="Label" name="experienceLabel" placeholder="05 / EXPERIENCE" />
              <InputField label="Heading" name="experienceHeading" placeholder="Where I've made an impact" />
              <InputField label="Subtitle" name="experienceSubtitle" placeholder="A journey through internships..." />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Research Section</h4>
              <InputField label="Label" name="researchLabel" placeholder="06 / RESEARCH" />
              <InputField label="Heading" name="researchHeading" placeholder="Thinking deeply about markets" />
              <InputField label="Subtitle" name="researchSubtitle" placeholder="Research papers, whitepapers..." />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: SEO */}
      <div>
        <SectionHeader id="seo" title="SEO & Metadata" emoji="🔍" />
        {expandedSection === 'seo' && (
          <div className="p-6 border border-foreground/10 border-t-0 rounded-b-xl bg-background space-y-4">
            <InputField label="Site Title" name="siteTitle" placeholder="Aditya Jagtap — Strategy & Finance Portfolio" />
            <InputField label="Meta Description" name="siteDescription" type="textarea" placeholder="Personal portfolio showcasing..." />
            <input type="hidden" {...register('ogImage')} />
            <ImageUploader
              label="OG image"
              value={ogImage}
              onChange={(url) => setValue('ogImage', url as string, { shouldDirty: true })}
            />
          </div>
        )}
      </div>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-0 pt-6 pb-4 bg-background border-t border-foreground/10 flex justify-end gap-4 -mx-8 px-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
