"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, X } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiData } from '@/lib/api-client';

interface FunFact {
  icon: string;
  label: string;
  value: string;
}

interface AboutFormData {
  title: string;
  subtitle: string;
  bio: string;
  philosophyQuote: string;
  currentlyReading: string;
  currentlyLearning: string;
  education: string;
  experience: string;
  certifications: string;
  interests: string;
  resumeUrl: string;
  photo: string;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AboutFormData>();
  const photo = watch('photo') || '';

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/about', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const about = getApiData<any>(data);

        if (about) {
          setUpdatedAt(about.updatedAt || null);

          setValue('title', about.title || '');
          setValue('subtitle', about.subtitle || '');
          setValue('bio', about.bio || '');
          setValue('philosophyQuote', about.philosophyQuote || '');
          setValue('currentlyReading', about.currentlyReading || '');
          setValue('currentlyLearning', about.currentlyLearning || '');
          setValue('education', Array.isArray(about.education) ? about.education.join('\n') : '');
          setValue('experience', Array.isArray(about.experience) ? about.experience.join('\n') : '');
          setValue('certifications', Array.isArray(about.certifications) ? about.certifications.join('\n') : '');
          setValue('interests', Array.isArray(about.interests) ? about.interests.join(', ') : '');
          setValue('resumeUrl', about.resumeUrl || '');
          setValue('photo', about.photo || about.profileImage || '');

          // Set fun facts
          if (Array.isArray(about.funFacts) && about.funFacts.length > 0) {
            setFunFacts(about.funFacts);
          } else {
            // Default fun facts
            setFunFacts([
              { icon: 'Coffee', label: 'Coffee consumed', value: '500+ cups' },
              { icon: 'BookOpen', label: 'Case studies analyzed', value: '100+' },
              { icon: 'TrendingUp', label: 'Market research reports', value: '50+' },
              { icon: 'Users', label: 'Team projects led', value: '15+' },
            ]);
          }
        }
        setError(null);
      } else {
        setError('Failed to load about page data');
      }
    } catch (error: any) {
      console.error('Error fetching about:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out - check MongoDB Atlas IP whitelist');
      } else {
        setError('Failed to load about page data');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AboutFormData) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        education: typeof data.education === 'string'
          ? data.education.split('\n').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(data.education) ? data.education : []),
        experience: typeof data.experience === 'string'
          ? data.experience.split('\n').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(data.experience) ? data.experience : []),
        certifications: typeof data.certifications === 'string'
          ? data.certifications.split('\n').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(data.certifications) ? data.certifications : []),
        interests: typeof data.interests === 'string'
          ? data.interests.split(',').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(data.interests) ? data.interests : []),
        funFacts: funFacts,
      };

      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const jsonData = await response.json().catch(() => null);

      if (!response.ok || !jsonData?.ok) {
        const errorMsg = jsonData?.error?.message
          || jsonData?.error
          || jsonData?.message
          || `Server error (${response.status}: ${response.statusText})`;

        console.error('Save failed:', { status: response.status, data: jsonData });
        alert(`❌ Failed to save: ${errorMsg}`);
        return;
      }

      alert('✅ About page saved successfully!');
      fetchAbout();
    } catch (error) {
      console.error('Error saving about:', error);
      const errorMsg = error instanceof Error ? error.message : 'Network error or invalid response';
      alert(`❌ Failed to save: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const addFunFact = () => {
    setFunFacts([...funFacts, { icon: 'Star', label: '', value: '' }]);
  };

  const removeFunFact = (index: number) => {
    setFunFacts(funFacts.filter((_, i) => i !== index));
  };

  const updateFunFact = (index: number, field: keyof FunFact, value: string) => {
    const updated = [...funFacts];
    updated[index] = { ...updated[index], [field]: value };
    setFunFacts(updated);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never saved';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Never saved';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Never saved';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <div className="text-red-400 font-semibold mb-2">⚠️ {error}</div>
          <p className="text-red-300/80 text-sm mb-4">
            Database connection failed. Whitelist your IP at{' '}
            <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline">
              cloud.mongodb.com
            </a>
            {' '}→ Network Access
          </p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchAbout();
            }}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">About Page</h1>
          <p className="text-foreground/60 text-sm mt-1">Last saved: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-serif font-bold mb-6">Basic Information</h2>

          <AdminFormField
            label="Title"
            name="title"
            register={register}
            error={errors.title}
            required
            placeholder="e.g., About Aditya"
          />

          <AdminFormField
            label="Subtitle"
            name="subtitle"
            register={register}
            error={errors.subtitle}
            placeholder="e.g., Finance Professional | Strategy Consultant"
          />

          <AdminFormField
            label="Bio"
            name="bio"
            type="textarea"
            rows={6}
            register={register}
            error={errors.bio}
            placeholder="Write a compelling professional bio..."
          />

          <input type="hidden" {...register('photo')} />
          <ImageUploader
            label="Profile image"
            value={photo}
            onChange={(url) => setValue('photo', url as string, { shouldDirty: true })}
          />

          <AdminFormField
            label="Resume URL"
            name="resumeUrl"
            type="url"
            register={register}
            error={errors.resumeUrl}
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        {/* Philosophy & Current Activities */}
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-serif font-bold mb-6">Philosophy & Current Activities</h2>

          <AdminFormField
            label="Philosophy Quote"
            name="philosophyQuote"
            type="textarea"
            rows={3}
            register={register}
            error={errors.philosophyQuote}
            placeholder="Your personal philosophy or favorite quote"
          />

          <AdminFormField
            label="Currently Reading"
            name="currentlyReading"
            register={register}
            error={errors.currentlyReading}
            placeholder="e.g., Zero to One by Peter Thiel"
          />

          <AdminFormField
            label="Currently Learning"
            name="currentlyLearning"
            register={register}
            error={errors.currentlyLearning}
            placeholder="e.g., Advanced Financial Modeling & Valuation"
          />
        </div>

        {/* Fun Facts / Stats */}
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold">Fun Facts / Stats</h2>
            <button
              type="button"
              onClick={addFunFact}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium text-sm"
            >
              <Plus size={16} />
              Add Stat
            </button>
          </div>

          <p className="text-foreground/60 text-sm mb-4">
            Available icons: Coffee, BookOpen, TrendingUp, Users, Award, Target, Briefcase, Star, BarChart3, Lightbulb
          </p>

          <div className="space-y-4">
            {funFacts.map((fact, index) => (
              <div key={index} className="flex gap-3 items-start p-4 bg-foreground/[0.02] border border-foreground/10 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={fact.icon}
                    onChange={(e) => updateFunFact(index, 'icon', e.target.value)}
                    placeholder="Icon (e.g., Coffee)"
                    className="px-3 py-2 bg-background border border-foreground/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <input
                    type="text"
                    value={fact.label}
                    onChange={(e) => updateFunFact(index, 'label', e.target.value)}
                    placeholder="Label (e.g., Coffee consumed)"
                    className="px-3 py-2 bg-background border border-foreground/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <input
                    type="text"
                    value={fact.value}
                    onChange={(e) => updateFunFact(index, 'value', e.target.value)}
                    placeholder="Value (e.g., 500+ cups)"
                    className="px-3 py-2 bg-background border border-foreground/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFunFact(index)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  aria-label="Remove"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-serif font-bold mb-6">Education & Experience</h2>

          <AdminFormField
            label="Education (one per line)"
            name="education"
            type="textarea"
            rows={6}
            register={register}
            error={errors.education}
            placeholder="MBA, Harvard Business School
BS Finance, University of XYZ"
          />

          <AdminFormField
            label="Experience (one per line)"
            name="experience"
            type="textarea"
            rows={8}
            register={register}
            error={errors.experience}
            placeholder="Senior Analyst, McKinsey & Company (2020-2023)
Financial Analyst, Goldman Sachs (2018-2020)"
          />

          <AdminFormField
            label="Certifications (one per line)"
            name="certifications"
            type="textarea"
            rows={4}
            register={register}
            error={errors.certifications}
            placeholder="CFA Level I
Six Sigma Green Belt"
          />

          <AdminFormField
            label="Interests (comma-separated)"
            name="interests"
            type="textarea"
            rows={3}
            register={register}
            error={errors.interests}
            placeholder="Financial Markets, Data Analytics, Strategy Consulting"
          />
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
