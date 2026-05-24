"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';

interface SkillFormData {
  name: string;
  category: string;
  icon: string;
  proficiency: string;
  order: string;
}

export default function NewSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SkillFormData>({
    defaultValues: {
      icon: 'Star',
      proficiency: '3',
      order: '0',
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        proficiency: data.proficiency ? parseInt(data.proficiency) : 3,
        order: data.order ? parseInt(data.order) : 0,
      };

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      alert('✅ Skill created successfully!');
      router.push('/admin/skills');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Error: ${msg}`);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Add new skill</h1>

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
