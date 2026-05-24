"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { Star, Search } from 'lucide-react';

interface Project {
  _id: string;
  slug?: string;
  title?: string;
  category?: string;
  coverImage?: string;
  featured?: boolean;
  updatedAt?: string;
}

const categories = ['All', 'Strategy', 'Finance', 'Consulting', 'Research', 'Academic'];

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchQuery]);

  const fetchProjects = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/projects', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      if (error.name === 'AbortError') {
        console.warn('⚠️ Projects fetch timed out - check MongoDB Atlas IP whitelist');
      }
      setProjects([]); // Set empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/projects/${project.slug}/edit`);
  };

  const handleDelete = (project: Project) => {
    setDeleteModal({ isOpen: true, project });
  };

  const confirmDelete = async () => {
    if (!deleteModal.project) return;

    try {
      const response = await fetch(`/api/projects/${deleteModal.project.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete project';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      // Success - update UI
      setProjects(projects.filter((p) => p._id !== deleteModal.project?._id));
      setDeleteModal({ isOpen: false, project: null });
      alert('✅ Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const columns = [
    {
      key: 'coverImage',
      label: 'Cover',
      render: (value: string | undefined, row: Project) => {
        if (value) {
          return (
            <img
              src={value}
              alt={row.title || 'Project'}
              className="w-12 h-12 rounded-lg object-cover"
            />
          );
        }
        return (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
            {row.title?.charAt(0)?.toUpperCase() || 'P'}
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
      key: 'featured',
      label: 'Featured',
      render: (value: boolean | undefined) => (
        value ? <Star className="w-4 h-4 text-yellow-500 fill-current" /> : <span className="text-foreground/30">—</span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: string | undefined) => (
        <span className="text-foreground/60">{formatDate(value)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        subtitle="Manage your case studies"
        actionLabel="New Project"
        actionHref="/admin/projects/new"
      />

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary text-background'
                : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-foreground/60 mb-4">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, project: null })}
        itemName={deleteModal.project?.title || 'this project'}
      />
    </div>
  );
}
