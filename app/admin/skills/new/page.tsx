"use client";

import { useState, useEffect } from 'react';
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

const DEFAULT_CATEGORIES = ['Financial', 'Strategy', 'Analytical', 'Soft Skills'];

export default function NewSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SkillFormData>({
    defaultValues: {
      icon: 'Star',
      proficiency: '3',
      order: '0',
    },
  });

  // Fetch existing categories from skills
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            // Extract unique categories
            const categories = [...new Set(data.data.map((skill: any) => skill.category).filter(Boolean))];
            // Combine default and existing categories
            const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])] as string[];
            setExistingCategories(allCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setExistingCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: SkillFormData) => {
    setLoading(true);

    try {
      // Use custom category if "Add New" was selected
      const finalCategory = showCustomCategory ? customCategory.trim() : data.category;

      if (!finalCategory) {
        alert('❌ Please enter a category');
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        category: finalCategory,
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
              <option value="Other">Other (Type custom category)</option>
            </select>
            {errors.category && !showCustomCategory && <p className="text-red-500 text-xs mt-1">Category is required</p>}

            {/* Show custom input when "Other" is selected */}
            {showCustomCategory && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name (e.g., Technical, Design, Marketing)"
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
