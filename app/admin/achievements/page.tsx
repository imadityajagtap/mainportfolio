"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTable from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { CheckCircle2 } from 'lucide-react';

interface Achievement {
  _id: string;
  title?: string;
  issuer?: string;
  type?: string;
  rank?: string;
  date?: string;
  verified?: boolean;
}

const types = ['All', 'Award', 'Certification', 'Competition', 'Recognition'];

export default function AdminAchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; achievement: Achievement | null }>({
    isOpen: false,
    achievement: null,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    let filtered = achievements;

    if (activeTab !== 'All') {
      filtered = filtered.filter((a) => a.type === activeTab);
    }

    setFilteredAchievements(filtered);
  }, [achievements, activeTab]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        const sorted = (Array.isArray(data.data) ? data.data : []).sort((a: Achievement, b: Achievement) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        setAchievements(sorted);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    router.push(`/admin/achievements/${achievement._id}/edit`);
  };

  const handleDelete = (achievement: Achievement) => {
    setDeleteModal({ isOpen: true, achievement });
  };

  const confirmDelete = async () => {
    if (!deleteModal.achievement) return;

    try {
      const response = await fetch(`/api/achievements/${deleteModal.achievement._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAchievements(achievements.filter((a) => a._id !== deleteModal.achievement?._id));
        setDeleteModal({ isOpen: false, achievement: null });
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const getTypeIcon = (type?: string): string => {
    switch (type) {
      case 'Award':
        return '🏆';
      case 'Certification':
        return '📜';
      case 'Competition':
        return '🎖️';
      case 'Recognition':
        return '⭐';
      default:
        return '🏅';
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Icon',
      render: (value: string | undefined) => (
        <span className="text-2xl">{getTypeIcon(value)}</span>
      ),
    },
    {
      key: 'title',
      label: 'Title & Issuer',
      render: (value: string | undefined, row: Achievement) => (
        <div>
          <div className="font-medium text-foreground">{value || 'Untitled'}</div>
          <div className="text-sm text-foreground/60">{row.issuer || 'Unknown Issuer'}</div>
        </div>
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
      key: 'rank',
      label: 'Rank',
      render: (value: string | undefined) => (
        <span className="text-foreground/70 text-sm">{value || '—'}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string | undefined) => (
        <span className="text-foreground/60">{formatDate(value)}</span>
      ),
    },
    {
      key: 'verified',
      label: 'Verified',
      render: (value: boolean | undefined) => (
        value ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <span className="text-foreground/30">—</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        subtitle="Awards & certifications"
        actionLabel="Add Achievement"
        actionHref="/admin/achievements/new"
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
        data={filteredAchievements}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, achievement: null })}
        itemName={deleteModal.achievement?.title || 'this achievement'}
      />
    </div>
  );
}
