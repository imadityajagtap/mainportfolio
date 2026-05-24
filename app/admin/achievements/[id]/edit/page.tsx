"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiData, getApiErrorMessage, readApiJson } from '@/lib/api-client';

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

export default function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [achievementTitle, setAchievementTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AchievementFormData>();
  const imageUrl = watch('imageUrl') || '';

  useEffect(() => {
    fetchAchievement();
  }, []);

  const fetchAchievement = async () => {
    try {
      const response = await fetch(`/api/achievements/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        const achievement = getApiData<any>(data);

        if (achievement) {
          setAchievementTitle(achievement.title || '');
          setUpdatedAt(achievement.updatedAt || null);

          setValue('title', achievement.title || '');
          setValue('issuer', achievement.issuer || '');
          setValue('description', achievement.description || '');
          setValue('credentialUrl', achievement.credentialUrl || '');
          setValue('imageUrl', achievement.imageUrl || '');
          setValue('type', achievement.type || '');
          setValue('date', achievement.date ? achievement.date.split('T')[0] : '');
          setValue('rank', achievement.rank || '');
          setValue('verified', achievement.verified || false);
        }
      }
    } catch (error) {
      console.error('Error fetching achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AchievementFormData) => {
    setSaving(true);

    try {
      const response = await fetch(`/api/achievements/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/achievements');
      } else {
        alert(`Failed to update achievement: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/achievements/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/achievements');
      } else {
        alert(`Failed to delete achievement: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('An error occurred');
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
        <p className="text-foreground/60">Loading achievement...</p>
      </div>
    );
  }

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit achievement</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

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

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
              >
                Delete achievement
              </button>
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
        itemName={achievementTitle}
      />
    </div>
  );
}
