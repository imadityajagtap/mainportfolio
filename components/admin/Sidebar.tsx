"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  GraduationCap,
  BookOpen,
  Trophy,
  Zap,
  User,
  Settings,
  Mail,
  FileDown,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

const navGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { name: 'Projects', href: '/admin/projects', icon: Briefcase },
      { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
      { name: 'Experience', href: '/admin/experience', icon: GraduationCap },
      { name: 'Research', href: '/admin/research', icon: BookOpen },
      { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
      { name: 'Skills', href: '/admin/skills', icon: Zap },
    ],
  },
  {
    label: 'PROFILE',
    items: [
      { name: 'About Me', href: '/admin/about', icon: User },
      { name: 'Resume', href: '/admin/resume', icon: FileDown },
      { name: 'Site Settings', href: '/admin/site-settings', icon: Settings },
    ],
  },
  {
    label: 'COMMUNICATIONS',
    items: [
      { name: 'Messages', href: '/admin/messages', icon: Mail },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages?read=false');
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setUnreadCount(data.data.length);
          }
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const userName = session?.user?.name || 'Admin';
  const userEmail = session?.user?.email || '';
  const userInitial = userName?.charAt(0)?.toUpperCase() || 'A';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-foreground/[0.02] border-r border-foreground/10 flex flex-col z-40">
      {/* TOP - Logo */}
      <div className="p-6 border-b border-foreground/10">
        <h1 className="text-2xl font-serif font-bold">
          <span className="text-primary">A</span>
          <span className="text-secondary">J</span>
          <span className="ml-2 text-foreground">Admin</span>
        </h1>
        <p className="text-xs text-foreground/60 font-mono mt-1">Portfolio CMS</p>
      </div>

      {/* NAV - Navigation groups */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            <p className="text-xs font-mono text-secondary uppercase tracking-wider mb-2 px-4">
              {group.label}
            </p>

            {/* Group items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                const isMessages = item.name === 'Messages';

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>

                    {/* Unread badge for messages */}
                    {isMessages && unreadCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-secondary text-background text-xs rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* BOTTOM - User info + actions */}
      <div className="p-4 border-t border-foreground/10">
        {/* User card */}
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-foreground/[0.02]">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-foreground/60 truncate">{userEmail}</p>
          </div>
        </div>

        {/* View site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-foreground/5 rounded-lg transition-colors"
        >
          View site
          <ExternalLink size={14} />
        </a>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full mt-2 px-4 py-2 text-sm text-foreground/70 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors flex items-center gap-2 justify-center"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
