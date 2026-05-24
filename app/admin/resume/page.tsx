"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, ExternalLink } from 'lucide-react';
import AdminFormField from '@/components/admin/AdminFormField';

interface ResumeFormData {
  resumeUrl: string;
  resumeLabel: string;
}

export default function ResumePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResumeFormData>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        const settings = data.data;

        if (settings) {
          setCurrentResumeUrl(settings.resumeUrl || null);
          setResumeUpdatedAt(settings.resumeUpdatedAt || null);
          setValue('resumeUrl', settings.resumeUrl || '');
          setValue('resumeLabel', settings.resumeLabel || 'Download Resume');
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ResumeFormData) => {
    setSaving(true);

    try {
      const payload = {
        resumeUrl: data.resumeUrl.trim(),
        resumeLabel: data.resumeLabel.trim(),
        resumeUpdatedAt: data.resumeUrl.trim() ? new Date().toISOString() : null,
      };

      const response = await fetch('/api/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update: ${errorData.error || errorData.message || 'Unknown error'}`);
        return;
      }

      alert('✅ Resume settings updated successfully!');
      fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Never';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Never';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading resume settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Resume Management</h1>
        <p className="text-foreground/60 mt-1">Update your resume URL and display settings</p>
      </div>

      {/* Status Card */}
      <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">Current Resume Status</h3>

            {currentResumeUrl ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium text-foreground">Active</span>
                </div>
                <p className="text-sm text-foreground/60 mb-3">
                  Last updated: {formatDate(resumeUpdatedAt)}
                </p>
                <a
                  href={currentResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View current resume
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm font-medium text-foreground">Not Set</span>
                </div>
                <p className="text-sm text-foreground/60">
                  No resume URL configured. Visitors will see a "not available" message.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-serif font-bold">Resume Settings</h2>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Resume URL
            </label>
            <input
              {...register('resumeUrl')}
              type="url"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="https://drive.google.com/file/d/your-resume-id/view"
            />
            <p className="text-foreground/60 text-xs mt-2">
              Upload your resume to Google Drive, Dropbox, or any public file host and paste the shareable link here
            </p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Button Label (optional)
            </label>
            <input
              {...register('resumeLabel')}
              type="text"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Download Resume"
            />
            <p className="text-foreground/60 text-xs mt-2">
              Custom text for the resume button (default: 'Download Resume')
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">💡 Quick Guide</h4>
            <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
              <li>Upload your resume PDF to Google Drive or Dropbox</li>
              <li>Set sharing permissions to "Anyone with the link can view"</li>
              <li>Copy the shareable link and paste it in the Resume URL field</li>
              <li>Leave the Resume URL empty to disable the download button</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
