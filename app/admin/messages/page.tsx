"use client";

import { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { Eye, Mail, Trash2 } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; message: Message | null }>({
    isOpen: false,
    message: null,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/messages', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      if (error.name === 'AbortError') {
        console.warn('⚠️ Messages fetch timed out - check MongoDB Atlas IP whitelist');
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);

    // Mark as read if not already
    if (!message.read) {
      try {
        const response = await fetch(`/api/messages/${message._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        });

        if (response.ok) {
          setMessages((prev) =>
            prev.map((m) => (m._id === message._id ? { ...m, read: true } : m))
          );
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDelete = (message: Message) => {
    setDeleteModal({ isOpen: true, message });
  };

  const confirmDelete = async () => {
    if (!deleteModal.message) return;

    try {
      const response = await fetch(`/api/messages/${deleteModal.message._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to delete message';
        alert(`❌ Delete failed: ${errorMessage}`);
        console.error('Delete error:', errorData);
        return;
      }

      // Success - update UI
      setMessages(messages.filter((m) => m._id !== deleteModal.message?._id));
      setDeleteModal({ isOpen: false, message: null });

      // Close view modal if viewing the deleted message
      if (selectedMessage?._id === deleteModal.message._id) {
        setIsViewModalOpen(false);
        setSelectedMessage(null);
      }

      alert('✅ Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/60">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        subtitle="Contact form submissions"
        actionLabel={null}
        actionHref={null}
      />

      {/* Messages Table */}
      <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-foreground/40" />
            </div>
            <p className="text-foreground/60 text-lg">No messages yet</p>
            <p className="text-foreground/40 text-sm mt-1">Messages from your contact form will appear here</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10">
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message._id}
                  className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-foreground">{message.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{message.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-foreground/80 max-w-md truncate">{message.message}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.read
                          ? 'bg-foreground/5 text-foreground/60'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {message.read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleView(message)}
                        className="p-2 text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all"
                        aria-label="View message"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(message)}
                        className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        aria-label="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Message Modal */}
      {isViewModalOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-background rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-foreground/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Message from {selectedMessage.name}
              </h2>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-foreground/60 uppercase tracking-wider block mb-1">
                  Name
                </label>
                <p className="text-foreground">{selectedMessage.name}</p>
              </div>

              <div>
                <label className="text-xs font-mono text-foreground/60 uppercase tracking-wider block mb-1">
                  Email
                </label>
                <p className="text-foreground">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-foreground/60 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <p className="text-foreground/80">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              <div>
                <label className="text-xs font-mono text-foreground/60 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.read
                      ? 'bg-foreground/5 text-foreground/60'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {selectedMessage.read ? 'Read' : 'Unread'}
                </span>
              </div>

              <hr className="border-foreground/10" />

              <div>
                <label className="text-xs font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Message
                </label>
                <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-4">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage)}
                  className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-medium"
                >
                  Delete Message
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2.5 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, message: null })}
        itemName={`message from ${deleteModal.message?.name || 'this sender'}`}
      />
    </div>
  );
}
