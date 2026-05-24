"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiErrorMessage, readApiJson } from '@/lib/api-client';

interface AchievementFormData {
  title: string;
  issuer: string;
  description: string;
  credentialUrl: string;
  imageUrl: string;
  type: string;
  date: string;
  rank: string;
  verified: boolean;
}

export default function NewAchievementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AchievementFormData>({
    defaultValues: {
      imageUrl: '',
      verified: false,
    },
  });
  const imageUrl = watch('imageUrl') || '';

  const onSubmit = async (data: AchievementFormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/achievements');
      } else {
        alert(`Failed to create achievement: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error creating achievement:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/achievements"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to achievements
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Add new achievement</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Achievement Details</h2>

              <AdminFormField
                label="Title"
                name="title"
                register={register}
                error={errors.title}
                required
                placeholder="e.g., Best MBA Capstone Project"
              />

              <AdminFormField
                label="Issuer"
                name="issuer"
                register={register}
                error={errors.issuer}
                required
                placeholder="e.g., XYZ Business School"
              />

              <AdminFormField
                label="Description"
                name="description"
                type="textarea"
                rows={3}
                register={register}
                error={errors.description}
                placeholder="Brief description of the achievement"
              />

              <AdminFormField
                label="Credential URL"
                name="credentialUrl"
                type="url"
                register={register}
                error={errors.credentialUrl}
                placeholder="Verification link (optional)"
              />

              <input type="hidden" {...register('imageUrl')} />
              <ImageUploader
                label="Image"
                value={imageUrl}
                onChange={(url) => setValue('imageUrl', url as string, { shouldDirty: true })}
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
                  <option value="Award">Award</option>
                  <option value="Certification">Certification</option>
                  <option value="Competition">Competition</option>
                  <option value="Recognition">Recognition</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">Type is required</p>}
              </div>

              <AdminFormField
                label="Date"
                name="date"
                type="date"
                register={register}
                error={errors.date}
                required
              />

              <AdminFormField
                label="Rank"
                name="rank"
                register={register}
                error={errors.rank}
                placeholder="e.g., 1st Place, Top 10 (optional)"
              />

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('verified')}
                    className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-foreground">Verified achievement</span>
                </label>
                <p className="text-xs text-foreground/40 mt-2 ml-8">Shows checkmark badge on public site</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 -mx-8 -mb-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/achievements"
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
