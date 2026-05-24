"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
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

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>();

  const content = watch('content');
  const coverImage = watch('coverImage') || '';

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${resolvedParams.slug}`);
      if (response.ok) {
        const data = await response.json();
        const post = data.data;

        if (post) {
          setPostTitle(post.title || '');
          setUpdatedAt(post.updatedAt || null);

          setValue('title', post.title || '');
          setValue('slug', post.slug || '');
          setValue('excerpt', post.excerpt || '');
          setValue('content', post.content || '');
          setValue('coverImage', post.coverImage || '');
          setValue('category', post.category || '');
          setValue('tags', Array.isArray(post.tags) ? post.tags.join(', ') : '');
          setValue('author', post.author || 'Aditya Jagtap');
          setValue('readTime', post.readTime?.toString() || '');
          setValue('published', post.published || false);
          setValue('featured', post.featured || false);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setValue('content', newContent);

    const wordCount = newContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    setValue('readTime', readTime.toString());
  };

  const onSubmit = async (data: BlogFormData) => {
    setSaving(true);

    try {
      const payload = {
        ...data,
        tags: typeof data.tags === 'string'
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : (Array.isArray(data.tags) ? data.tags : []),
        readTime: data.readTime ? parseInt(data.readTime) : undefined,
        publishDate: data.published ? new Date().toISOString() : undefined,
      };

      const response = await fetch(`/api/blog/${resolvedParams.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update: ${errorData.error || errorData.message || 'Unknown error'}`);
        return;
      }

      alert('✅ Post updated successfully!');
      router.push('/admin/blog');
      router.refresh(); // ✅ Force fresh data fetch
    } catch (error) {
      console.error('Error updating post:', error);
      alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blog/${resolvedParams.slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/blog');
        router.refresh(); // ✅ Force fresh data fetch
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || 'Failed to delete post';
        alert(`Failed to delete post: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
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
        <p className="text-foreground/60">Loading post...</p>
      </div>
    );
  }

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Edit post</h1>
          <p className="text-foreground/60 text-sm mt-1">Last updated: {formatDate(updatedAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM (left - spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Content</h2>

              <AdminFormField
                label="Title"
                name="title"
                register={register}
                error={errors.title}
                required
                placeholder="Post title"
              />

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
                  {...register('category', { required: true })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Finance">Finance</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Markets">Markets</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Personal">Personal</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
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

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="w-full mt-4 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
              >
                Delete post
              </button>
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
            disabled={saving}
            className="px-6 py-2.5 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-all font-medium disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </form>

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
        itemName={postTitle}
      />
    </div>
  );
}
