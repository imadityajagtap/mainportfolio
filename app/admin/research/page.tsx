"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { Star } from 'lucide-react';

interface Research {
  _id: string;
  title?: string;
  type?: string;
  publishedDate?: string;
  readTime?: number;
  featured?: boolean;
}

const types = ['All', 'Whitepaper', 'Research', 'Analysis', 'Thesis'];

export default function AdminResearchPage() {
  const router = useRouter();
  const [research, setResearch] = useState<Research[]>([]);
  const [filteredResearch, setFilteredResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; research: Research | null }>({
    isOpen: false,
    research: null,
  });

  useEffect(() => {
    fetchResearch();
  }, []);

  useEffect(() => {
    let filtered = research;

    if (activeTab !== 'All') {
      filtered = filtered.filter((r) => r.type === activeTab);
    }

    setFilteredResearch(filtered);
  }, [research, activeTab]);

  const fetchResearch = async () => {
    try {
      const response = await fetch('/api/research');
      if (response.ok) {
        const data = await response.json();
        const sorted = (Array.isArray(data.data) ? data.data : []).sort((a: Research, b: Research) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        });
        setResearch(sorted);
      }
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (research: Research) => {
    router.push(`/admin/research/${research._id}/edit`);
  };

  const handleDelete = (research: Research) => {
    setDeleteModal({ isOpen: true, research });
  };

  const confirmDelete = async () => {
    if (!deleteModal.research) return;

    try {
      const response = await fetch(`/api/research/${deleteModal.research._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete research';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      // Success - update UI
      setResearch(research.filter((r) => r._id !== deleteModal.research?._id));
      setDeleteModal({ isOpen: false, research: null });
      alert('✅ Research deleted successfully!');
    } catch (error) {
      console.error('Error deleting research:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Not published';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not published';
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return 'Not published';
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string | undefined) => (
        <span className="font-medium">{value || 'Untitled'}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string | undefined) => (
        <span className="px-3 py-1 bg-foreground/5 text-foreground/80 rounded-full text-xs font-medium">
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'publishedDate',
      label: 'Published',
      render: (value: string | undefined) => (
        <span className="text-foreground/60">{formatDate(value)}</span>
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
      key: 'featured',
      label: 'Featured',
      render: (value: boolean | undefined) => (
        value ? <Star className="w-4 h-4 text-yellow-500 fill-current" /> : <span className="text-foreground/30">—</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading research...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Research"
        subtitle="Manage publications & papers"
        actionLabel="Add Research"
        actionHref="/admin/research/new"
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-foreground/10">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === type
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredResearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, research: null })}
        itemName={deleteModal.research?.title || 'this research'}
      />
    </div>
  );
}
