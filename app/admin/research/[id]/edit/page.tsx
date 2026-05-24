"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiData } from '@/lib/api-client';

interface ResearchFormData {
  title: string;
  abstract: string;
  authors: string;
  pdfUrl: string;
  externalUrl: string;
  type: string;
  publishedDate: string;
  readTime: string;
  tags: string;
  coverImage: string;
  featured: boolean;
}

export default function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [researchTitle, setResearchTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ResearchFormData>();
  const coverImage = watch('coverImage') || '';

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const response = await fetch(`/api/research/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        const research = getApiData<any>(data);

        if (research) {
          setResearchTitle(research.title || '');
          setUpdatedAt(research.updatedAt || null);

          setValue('title', research.title || '');
          setValue('abstract', research.abstract || '');
          setValue('authors', Array.isArray(research.authors) ? research.authors.join(', ') : '');
          setValue('pdfUrl', research.pdfUrl || '');
          setValue('externalUrl', research.externalUrl || '');
          setValue('type', research.type || '');
          setValue('publishedDate', research.publishedDate ? research.publishedDate.split('T')[0] : '');
          setValue('readTime', research.readTime?.toString() || '');
          setValue('tags', Array.isArray(research.tags) ? research.tags.join(', ') : '');
          setValue('coverImage', research.coverImage || '');
          setValue('featured', research.featured || false);
        }
      }
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ResearchFormData) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        authors: data.authors ? data.authors.split(',').map((a) => a.trim()) : [],
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        readTime: data.readTime ? parseInt(data.readTime) : undefined,
      };

      const response = await fetch(`/api/research/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Always try to parse JSON response
      const jsonData = await response.json().catch(() => null);

      if (response.ok && jsonData?.ok) {
        alert('✅ Research updated successfully!');
        router.push('/admin/research');
        router.refresh(); // Refresh to see changes
      } else {
        // Extract error message from standardized response
        const errorMsg = jsonData?.error?.message
          || jsonData?.error
          || jsonData?.message
          || `Server error (${response.status}: ${response.statusText})`;

        console.error('Update failed:', { status: response.status, data: jsonData });
        alert(`❌ Failed to update research: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error updating research:', error);
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      alert(`Network or connection error: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/research/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete research';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      alert('✅ Research deleted successfully!');
      router.push('/admin/research');
      router.refresh();
    } catch (error) {
      console.error('Error deleting research:', error);
      const errorMsg = error instanceof Error ? error.message : 'Network error or invalid response';
      alert(`❌ Network or connection error: ${errorMsg}`);
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
        <p className="text-foreground/60">Loading research...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/research"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to research
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit research</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Research Details</h2>

              <AdminFormField
                label="Title"
                name="title"
                register={register}
                error={errors.title}
                required
                placeholder="Research paper title"
              />

              <AdminFormField
                label="Abstract"
                name="abstract"
                type="textarea"
                rows={6}
                register={register}
                error={errors.abstract}
                placeholder="Brief summary of the paper..."
              />

              <AdminFormField
                label="Authors (comma-separated)"
                name="authors"
                register={register}
                error={errors.authors}
                placeholder="Aditya Jagtap, Co-Author Name"
              />

              <AdminFormField
                label="PDF URL"
                name="pdfUrl"
                type="url"
                register={register}
                error={errors.pdfUrl}
                placeholder="https://example.com/paper.pdf"
              />

              <AdminFormField
                label="External URL"
                name="externalUrl"
                type="url"
                register={register}
                error={errors.externalUrl}
                placeholder="Link to published version (optional)"
              />
            </div>
          </div>

          {/* SIDEBAR (right) */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-serif font-bold mb-6">Metadata</h2>

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type', { required: true })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select type</option>
                  <option value="Whitepaper">Whitepaper</option>
                  <option value="Research">Research</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Thesis">Thesis</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">Type is required</p>}
              </div>

              <AdminFormField
                label="Published Date"
                name="publishedDate"
                type="date"
                register={register}
                error={errors.publishedDate}
              />

              <AdminFormField
                label="Read Time (minutes)"
                name="readTime"
                type="number"
                register={register}
                error={errors.readTime}
                placeholder="15"
              />

              <AdminFormField
                label="Tags (comma-separated)"
                name="tags"
                type="textarea"
                rows={3}
                register={register}
                error={errors.tags}
                placeholder="finance, strategy, markets"
              />

              <input type="hidden" {...register('coverImage')} />
              <ImageUploader
                label="Cover image"
                value={coverImage}
                onChange={(url) => setValue('coverImage', url as string, { shouldDirty: true })}
              />

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-foreground">Featured research</span>
                </label>
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
              >
                Delete research
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 -mx-8 -mb-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/research"
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
        itemName={researchTitle}
      />
    </div>
  );
}
