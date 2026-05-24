"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface SkillFormData {
  name: string;
  category: string;
  icon: string;
  proficiency: string;
  order: string;
}

export default function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SkillFormData>();

  useEffect(() => {
    fetchSkill();
  }, []);

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/skills/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        const skill = data.data;

        if (skill) {
          setSkillName(skill.name || '');
          setUpdatedAt(skill.updatedAt || null);

          setValue('name', skill.name || '');
          setValue('category', skill.category || '');
          setValue('icon', skill.icon || '');
          setValue('proficiency', skill.proficiency?.toString() || '3');
          setValue('order', skill.order?.toString() || '0');
        }
      }
    } catch (error) {
      console.error('Error fetching skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SkillFormData) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        proficiency: data.proficiency ? parseInt(data.proficiency) : 3,
        order: data.order ? parseInt(data.order) : 0,
      };

      const response = await fetch(`/api/skills/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update: ${errorData.error || errorData.message || 'Unknown error'}`);
        return;
      }

      alert('✅ Skill updated successfully!');
      router.push('/admin/skills');
    } catch (error) {
      console.error('Error updating skill:', error);
      alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/skills/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Skill deleted successfully!');
        router.push('/admin/skills');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
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
        <p className="text-foreground/60">Loading skill...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/skills"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to skills
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit skill</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-serif font-bold mb-6">Skill Details</h2>

          <AdminFormField
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            required
            placeholder="e.g., Python, React, SQL"
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
              <option value="Financial">Financial</option>
              <option value="Strategy">Strategy</option>
              <option value="Analytical">Analytical</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
          </div>

          <AdminFormField
            label="Icon"
            name="icon"
            register={register}
            error={errors.icon}
            placeholder="Star, Code, Chart, etc."
          />

          <AdminFormField
            label="Proficiency (1-4)"
            name="proficiency"
            type="number"
            register={register}
            error={errors.proficiency}
            placeholder="3"
          />

          <AdminFormField
            label="Order"
            name="order"
            type="number"
            register={register}
            error={errors.order}
            placeholder="0"
          />

          {/* Delete button */}
          <button
            type="button"
            onClick={() => setDeleteModal(true)}
            className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
          >
            Delete skill
          </button>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/skills"
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
        itemName={skillName}
      />
    </div>
  );
}
