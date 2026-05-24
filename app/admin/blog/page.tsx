"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { ExternalLink } from 'lucide-react';

interface BlogPost {
  _id: string;
  title?: string;
  slug?: string;
  category?: string;
  coverImage?: string;
  published?: boolean;
  readTime?: number;
  publishedDate?: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: BlogPost | null }>({
    isOpen: false,
    post: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (activeTab === 'published') {
      filtered = filtered.filter((p) => p.published === true);
    } else if (activeTab === 'drafts') {
      filtered = filtered.filter((p) => p.published !== true);
    }

    setFilteredPosts(filtered);
  }, [posts, activeTab]);

  const fetchPosts = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/blog', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      if (error.name === 'AbortError') {
        console.warn('⚠️ Blog fetch timed out - check MongoDB Atlas IP whitelist');
      }
      setPosts([]); // Set empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    router.push(`/admin/blog/${post.slug}/edit`);
  };

  const handleDelete = (post: BlogPost) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleView = (post: BlogPost) => {
    if (post.slug) {
      window.open(`/blog/${post.slug}`, '_blank');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.post) return;

    try {
      const response = await fetch(`/api/blog/${deleteModal.post.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete post';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      // Success - update UI
      setPosts(posts.filter((p) => p._id !== deleteModal.post?._id));
      setDeleteModal({ isOpen: false, post: null });
      alert('✅ Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Not published';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not published';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Not published';
    }
  };

  const columns = [
    {
      key: 'coverImage',
      label: 'Cover',
      render: (value: string | undefined, row: BlogPost) => {
        if (value) {
          return (
            <img
              src={value}
              alt={row.title || 'Post'}
              className="w-12 h-12 rounded-lg object-cover"
            />
          );
        }
        return (
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
            {row.title?.charAt(0)?.toUpperCase() || 'B'}
          </div>
        );
      },
    },
    {
      key: 'title',
      label: 'Title',
      render: (value: string | undefined) => (
        <span className="font-medium">{value || 'Untitled'}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string | undefined) => (
        <span className="px-3 py-1 bg-foreground/5 text-foreground/80 rounded-full text-xs font-medium">
          {value || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (value: boolean | undefined) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-500/10 text-green-600'
              : 'bg-yellow-500/10 text-yellow-600'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'readTime',
      label: 'Read Time',
      render: (value: number | undefined) => (
        <span className="text-foreground/60">{value ? `${value} min` : 'N/A'}</span>
      ),
    },
    {
      key: 'publishedDate',
      label: 'Published',
      render: (value: string | undefined) => (
        <span className="text-foreground/60">{formatDate(value)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        subtitle="Share your thoughts"
        actionLabel="Write Post"
        actionHref="/admin/blog/new"
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-foreground/10">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'published'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'drafts'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Table with custom actions */}
      <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground/60">No posts found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-foreground">
                      {column.render ? column.render(post[column.key as keyof BlogPost] as any, post) : post[column.key as keyof BlogPost]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all"
                        aria-label="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {post.published && (
                        <button
                          onClick={() => handleView(post)}
                          className="p-2 text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all"
                          aria-label="View"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post)}
                        className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        aria-label="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, post: null })}
        itemName={deleteModal.post?.title || 'this post'}
      />
    </div>
  );
}
