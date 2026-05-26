"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import ImageUploader from '@/components/admin/ImageUploader';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  author: string;
  readTime: string;
  published: boolean;
  featured: boolean;
}

const DEFAULT_CATEGORIES = ['Finance', 'Strategy', 'Consulting', 'Markets', 'Frameworks', 'Personal'];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      author: 'Aditya Jagtap',
      coverImage: '',
      published: false,
      featured: false,
    },
  });

  const title = watch('title');
  const content = watch('content');
  const coverImage = watch('coverImage') || '';

  // Fetch existing categories from blog posts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            // Extract unique categories
            const categories = [...new Set(data.data.map((post: any) => post.category).filter(Boolean))];
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

  // Auto-calculate read time
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setValue('content', newContent);

    const wordCount = newContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    setValue('readTime', readTime.toString());
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);

    try {
      // Use custom category if "Other" was selected
      const finalCategory = showCustomCategory ? customCategory.trim() : data.category;

      if (!finalCategory) {
        alert('❌ Please enter a category');
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        category: finalCategory,
        tags: typeof data.tags === 'string'
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : (Array.isArray(data.tags) ? data.tags : []),
        readTime: data.readTime ? parseInt(data.readTime) : undefined,
        publishDate: data.published ? new Date().toISOString() : undefined,
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to create: ${errorData.error || errorData.message || 'Unknown error'}`);
        return;
      }

      alert('✅ Post created successfully!');
      router.push('/admin/blog');
      router.refresh(); // ✅ Force fresh data fetch
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    setValue('published', false);
    handleSubmit(onSubmit)();
  };

  const publish = () => {
    setValue('published', true);
    handleSubmit(onSubmit)();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to blog
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Write new post</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Content</h2>

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: true })}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Post title"
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

              <AdminFormField
                label="Excerpt"
                name="excerpt"
                type="textarea"
                rows={3}
                register={register}
                error={errors.excerpt}
                placeholder="Short description (2-3 lines)"
              />

              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('content', { required: true })}
                  onChange={handleContentChange}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                  placeholder="Write your post content here... (Supports HTML and Markdown)"
                  rows={20}
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">Content is required</p>}
                <p className="text-xs text-foreground/40 mt-1">Supports HTML and Markdown</p>
              </div>

              <input type="hidden" {...register('coverImage')} />
              <ImageUploader
                label="Cover image"
                value={coverImage}
                onChange={(url) => setValue('coverImage', url as string, { shouldDirty: true })}
              />
            </div>
          </div>

          {/* SIDEBAR (right) */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-serif font-bold mb-6">Metadata</h2>

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
                label="Tags (comma-separated)"
                name="tags"
                type="textarea"
                rows={3}
                register={register}
                error={errors.tags}
                placeholder="finance, strategy, analysis"
              />

              <AdminFormField
                label="Author"
                name="author"
                register={register}
                error={errors.author}
                placeholder="Aditya Jagtap"
              />

              <AdminFormField
                label="Read Time (minutes)"
                name="readTime"
                type="number"
                register={register}
                error={errors.readTime}
                placeholder="Auto-calculated"
              />

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-foreground">Featured post</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 mt-8 -mx-8 -mb-8 p-6 border-t border-foreground/10 bg-background flex items-center justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-6 py-2.5 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-all font-medium"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={saveDraft}
            disabled={loading}
            className="px-6 py-2.5 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-all font-medium disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
