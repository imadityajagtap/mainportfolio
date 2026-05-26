"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
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

const DEFAULT_CATEGORIES = ['Strategy', 'Finance', 'Consulting', 'Research', 'Academic'];

function splitCsv(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      coverImage: '',
      images: [],
      featured: false,
    },
  });

  const coverImage = watch('coverImage') || '';
  const images = watch('images') || [];

  useEffect(() => {
    fetchProject();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const categories = [...new Set(data.data.map((project: any) => project.category).filter(Boolean))];
          const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])] as string[];
          setExistingCategories(allCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setExistingCategories(DEFAULT_CATEGORIES);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.slug}`);
      if (response.ok) {
        const data = await response.json();
        const project = data.data;

        if (project) {
          setProjectTitle(project.title || '');
          setUpdatedAt(project.updatedAt || null);
          setCurrentCategory(project.category || '');

          setValue('title', project.title || '');
          setValue('slug', project.slug || '');
          setValue('category', project.category || '');
          setValue('hook', project.hook || '');
          setValue('coverImage', project.coverImage || '');
          setValue('images', Array.isArray(project.images) ? project.images : []);
          setValue('problem', project.problemStatement || project.problem || '');
          setValue('approach', project.approach || '');
          setValue('analysis', project.analysis || '');
          setValue('recommendations', project.recommendations || '');
          setValue('results', project.results || '');
          setValue('impact', project.impactMetric || project.impact || '');
          setValue('duration', project.duration || '');
          setValue('role', project.role || '');
          setValue('year', project.year?.toString() || '');
          setValue('client', project.client || '');
          setValue('tools', Array.isArray(project.tools) ? project.tools.join(', ') : '');
          setValue('tags', Array.isArray(project.tags) ? project.tags.join(', ') : '');
          setValue('featured', project.featured || false);
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);

    try {
      // Use custom category if "Other" was selected
      const finalCategory = showCustomCategory ? customCategory.trim() : data.category;

      if (!finalCategory) {
        alert('❌ Please enter a category');
        setSaving(false);
        return;
      }

      const payload = {
        ...data,
        category: finalCategory,
        problemStatement: data.problem || '',
        impactMetric: data.impact || '',
        images: splitCsv(data.images),
        tools: splitCsv(data.tools),
        tags: splitCsv(data.tags),
        year: data.year ? parseInt(data.year) : undefined,
      };

      const response = await fetch(`/api/projects/${resolvedParams.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update (${response.status}): ${errorData.error || errorData.message || response.statusText}`);
        return;
      }

      alert('✅ Project updated successfully!');
      router.push('/admin/projects');
      router.refresh(); // ✅ Force fresh data fetch
    } catch (error) {
      console.error('Error updating project:', error);
      alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete project';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      alert('✅ Project deleted successfully!');
      router.push('/admin/projects');
      router.refresh(); // ✅ Force fresh data fetch
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading project...</p>
      </div>
    );
  }

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit project</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Basic Information</h2>

              <AdminFormField
                label="Title"
                name="title"
                register={register}
                error={errors.title}
                required
                placeholder="Project title"
              />

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
                  {...register('category', { required: !showCustomCategory })}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setShowCustomCategory(true);
                      setValue('category', '');
                    } else {
                      setShowCustomCategory(false);
                      setCustomCategory('');
                    }
                  }}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select category</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {errors.category && !showCustomCategory && <p className="text-red-500 text-xs mt-1">Category is required</p>}

                {/* Show custom input when "Other" is selected */}
                {showCustomCategory && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category name"
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      autoFocus
                    />
                    {!customCategory.trim() && (
                      <p className="text-red-500 text-xs mt-1">Please enter a category name</p>
                    )}
                  </div>
                )}
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

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
              >
                Delete project
              </button>
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
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
        itemName={projectTitle}
      />
    </div>
  );
}
