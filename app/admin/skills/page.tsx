"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
  order: number;
}

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/skills/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Skills</h1>
          <p className="text-foreground/60">Manage your skillset</p>
        </div>
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium"
        >
          <Plus size={18} />
          New Skill
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Financial', 'Strategy', 'Analytical', 'Soft Skills'].map((category) => {
          const categorySkills = skills.filter(
            (skill) => skill.category === category
          );

          return (
            <div
              key={category}
              className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">{category}</h3>
              <div className="space-y-3">
                {categorySkills.length === 0 ? (
                  <p className="text-foreground/40 text-sm">No skills in this category</p>
                ) : (
                  categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center justify-between p-3 bg-background border border-foreground/10 rounded-lg hover:border-foreground/20 transition-all"
                    >
                      <div>
                        <div className="text-foreground font-medium">{skill.name}</div>
                        <div className="text-foreground/60 text-sm">
                          Proficiency: {skill.proficiency}/4
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(skill._id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit skill"
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
