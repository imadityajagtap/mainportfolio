"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiErrorMessage, readApiJson } from '@/lib/api-client';

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

export default function NewResearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ResearchFormData>({
    defaultValues: {
      authors: 'Aditya Jagtap',
      coverImage: '',
      featured: false,
    },
  });
  const coverImage = watch('coverImage') || '';

  const onSubmit = async (data: ResearchFormData) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        authors: data.authors ? data.authors.split(',').map((a) => a.trim()) : [],
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        readTime: data.readTime ? parseInt(data.readTime) : undefined,
      };

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/research');
      } else {
        alert(`Failed to create research: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error creating research:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Add new research</h1>

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
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
