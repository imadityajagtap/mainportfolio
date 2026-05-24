"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil } from 'lucide-react';

interface Experience {
  _id: string;
  role?: string;
  company?: string;
  title?: string;
  organization?: string;
  type: string;
  startDate: string;
  endDate: string;
  order?: number;
}

export default function ExperiencePage() {
  const router = useRouter();
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/experience', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setExperience(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error: any) {
      console.error('Error fetching experience:', error);
      if (error.name === 'AbortError') {
        console.warn('⚠️ Experience fetch timed out - check MongoDB Atlas IP whitelist');
      }
      setExperience([]); // Set empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/experience/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading experience...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Experience</h1>
          <p className="text-foreground/60">
            Manage internships, leadership, competitions, and certifications
          </p>
        </div>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium"
        >
          <Plus size={18} />
          New Experience
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {['Internship', 'Leadership', 'Competition', 'Certification'].map((type) => {
          const typeExperience = experience.filter((exp) => exp.type === type);

          return (
            <div
              key={type}
              className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">{type}</h3>
              <div className="space-y-3">
                {typeExperience.length === 0 ? (
                  <p className="text-foreground/40 text-sm">No {type.toLowerCase()} items yet</p>
                ) : (
                  typeExperience.map((exp) => (
                    <div
                      key={exp._id}
                      className="p-4 bg-background border border-foreground/10 rounded-lg hover:border-foreground/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-foreground font-medium">{exp.role || exp.title || 'Role not set'}</h4>
                          <p className="text-foreground/60 text-sm">{exp.company || exp.organization || 'Company not set'}</p>
                          <p className="text-foreground/40 text-xs mt-1">
                            {exp.startDate} - {exp.endDate}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEdit(exp._id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit experience"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
