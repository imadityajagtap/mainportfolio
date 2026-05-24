"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DynamicArrayInput from '@/components/admin/DynamicArrayInput';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import { getApiData, getApiErrorMessage, readApiJson } from '@/lib/api-client';

interface ExperienceFormData {
  company: string;
  role: string;
  location: string;
  description: string;
  skills: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  logo: string;
}

export default function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<string[]>(['']);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExperienceFormData>();

  const current = watch('current');
  const logo = watch('logo') || '';

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await fetch(`/api/experience/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        const exp = getApiData<any>(data);

        if (exp) {
          const company = exp.company || exp.organization || '';
          const role = exp.role || exp.title || '';

          setExperienceTitle(`${role || 'Role'} at ${company || 'Company'}`);
          setUpdatedAt(exp.updatedAt || null);

          setValue('company', company);
          setValue('role', role);
          setValue('location', exp.location || '');
          setValue('description', exp.description || '');
          setValue('skills', Array.isArray(exp.skills) ? exp.skills.join(', ') : '');
          setValue('type', exp.type || '');
          setValue('startDate', exp.startDate ? exp.startDate.split('T')[0] : '');
          setValue('endDate', exp.endDate ? exp.endDate.split('T')[0] : '');
          setValue('current', exp.current || false);
          setValue('logo', exp.logo || '');

          if (Array.isArray(exp.achievements) && exp.achievements.length > 0) {
            setAchievements(exp.achievements);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setSaving(true);

    try {
      const payload = {
        company: data.company,
        role: data.role,
        location: data.location,
        description: data.description,
        type: data.type,
        startDate: data.startDate,
        endDate: data.current ? null : data.endDate || null,
        current: data.current,
        logo: data.logo || '',
        achievements: achievements.filter((a) => a.trim() !== ''),
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      const response = await fetch(`/api/experience/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/experience');
      } else {
        alert(`Failed to update experience: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/experience/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const jsonData = await readApiJson(response);

      if (response.ok) {
        router.push('/admin/experience');
      } else {
        alert(`Failed to delete experience: ${getApiErrorMessage(jsonData, response.statusText)}`);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
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
        <p className="text-foreground/60">Loading experience...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/experience"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to experience
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit experience</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Company Details</h2>

              <AdminFormField
                label="Company"
                name="company"
                register={register}
                error={errors.company}
                required
                placeholder="Company or organization name"
              />

              <AdminFormField
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                required
                placeholder="Your position/role"
              />

              <AdminFormField
                label="Location"
                name="location"
                register={register}
                error={errors.location}
                placeholder="e.g., Mumbai, India"
              />

              <AdminFormField
                label="Description"
                name="description"
                type="textarea"
                rows={4}
                register={register}
                error={errors.description}
                placeholder="Brief overview of your role and responsibilities"
              />

              <DynamicArrayInput
                label="Key Wins"
                values={achievements}
                onChange={setAchievements}
                placeholder="e.g., Increased revenue by 32%"
              />

              <AdminFormField
                label="Skills (comma-separated)"
                name="skills"
                type="textarea"
                rows={3}
                register={register}
                error={errors.skills}
                placeholder="Excel, Python, Financial Modeling"
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
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Competition">Competition</option>
                  <option value="Certification">Certification</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">Type is required</p>}
              </div>

              <AdminFormField
                label="Start Date"
                name="startDate"
                type="date"
                register={register}
                error={errors.startDate}
                required
              />

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('current')}
                    className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-foreground">Currently working here</span>
                </label>
              </div>

              {!current && (
                <AdminFormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  register={register}
                  error={errors.endDate}
                />
              )}

              <input type="hidden" {...register('logo')} />
              <ImageUploader
                label="Logo"
                value={logo}
                onChange={(url) => setValue('logo', url as string, { shouldDirty: true })}
              />

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
              >
                Delete experience
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 -mx-8 -mb-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/experience"
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
        itemName={experienceTitle}
      />
    </div>
  );
}
