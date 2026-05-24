"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import ImageUploader from '@/components/admin/ImageUploader';

interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  hook: string;
  coverImage: string;
  images: string[];
  problem: string;
  approach: string;
  analysis: string;
  recommendations: string;
  results: string;
  impact: string;
  duration: string;
  role: string;
  year: string;
  client: string;
  tools: string;
  tags: string;
  featured: boolean;
}

function splitCsv(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      coverImage: '',
      images: [],
      featured: false,
    },
  });

  const title = watch('title');
  const coverImage = watch('coverImage') || '';
  const images = watch('images') || [];

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);
    setValue('slug', generateSlug(newTitle));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        problemStatement: data.problem || '',
        impactMetric: data.impact || '',
        images: splitCsv(data.images),
        tools: splitCsv(data.tools),
        tags: splitCsv(data.tags),
        year: data.year ? parseInt(data.year) : undefined,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to create (${response.status}): ${errorData.error || errorData.message || response.statusText}`);
        return;
      }

      alert('✅ Project created successfully!');
      router.push('/admin/projects');
      router.refresh(); // ✅ Force fresh data fetch
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to projects
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Create new project</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Basic Information</h2>

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: true })}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Project title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
              </div>

              <AdminFormField
                label="Slug"
                name="slug"
                register={register}
                error={errors.slug}
                required
                placeholder="auto-generated-slug"
              />

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: true })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Finance">Finance</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Research">Research</option>
                  <option value="Academic">Academic</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
              </div>

              <AdminFormField
                label="Hook / Subtitle"
                name="hook"
                type="textarea"
                rows={2}
                register={register}
                error={errors.hook}
                placeholder="Short compelling description"
              />

              <ImageUploader
                label="Cover image"
                value={coverImage}
                onChange={(url) => setValue('coverImage', url as string, { shouldDirty: true })}
              />

              <ImageUploader
                label="Gallery images"
                multiple
                value={images}
                onChange={(urls) => setValue('images', urls as string[], { shouldDirty: true })}
              />
            </div>

            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Case Study Details</h2>

              <AdminFormField
                label="Problem"
                name="problem"
                type="textarea"
                rows={6}
                register={register}
                error={errors.problem}
                placeholder="Describe the problem or challenge..."
              />

              <AdminFormField
                label="Approach"
                name="approach"
                type="textarea"
                rows={6}
                register={register}
                error={errors.approach}
                placeholder="How did you approach the problem..."
              />

              <AdminFormField
                label="Analysis"
                name="analysis"
                type="textarea"
                rows={6}
                register={register}
                error={errors.analysis}
                placeholder="What analysis did you perform..."
              />

              <AdminFormField
                label="Recommendations"
                name="recommendations"
                type="textarea"
                rows={6}
                register={register}
                error={errors.recommendations}
                placeholder="What did you recommend..."
              />

              <AdminFormField
                label="Results"
                name="results"
                type="textarea"
                rows={6}
                register={register}
                error={errors.results}
                placeholder="What were the outcomes..."
              />
            </div>
          </div>

          {/* SIDEBAR (right) */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-serif font-bold mb-6">Metadata</h2>

              <AdminFormField
                label="Impact"
                name="impact"
                register={register}
                error={errors.impact}
                placeholder="e.g., 32% increase"
              />

              <AdminFormField
                label="Duration"
                name="duration"
                register={register}
                error={errors.duration}
                placeholder="e.g., 12 weeks"
              />

              <AdminFormField
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                placeholder="e.g., Lead Analyst"
              />

              <AdminFormField
                label="Year"
                name="year"
                type="number"
                register={register}
                error={errors.year}
                placeholder="2024"
              />

              <AdminFormField
                label="Client"
                name="client"
                register={register}
                error={errors.client}
                placeholder="Client name (optional)"
              />

              <AdminFormField
                label="Tools (comma-separated)"
                name="tools"
                type="textarea"
                rows={3}
                register={register}
                error={errors.tools}
                placeholder="Excel, Python, Tableau"
              />

              <AdminFormField
                label="Tags (comma-separated)"
                name="tags"
                type="textarea"
                rows={3}
                register={register}
                error={errors.tags}
                placeholder="analytics, strategy, finance"
              />

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-foreground">Featured project</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 -mx-8 -mb-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-2.5 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-all font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
