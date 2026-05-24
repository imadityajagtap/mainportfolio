import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import BlogPost from '@/models/BlogPost';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Message from '@/models/Message';
import Achievement from '@/models/Achievement';
import Research from '@/models/Research';

async function getDashboardStats() {
  try {
    await connectDB();

    const [
      projectCount,
      blogCount,
      skillCount,
      experienceCount,
      messageCount,
      achievementCount,
      researchCount,
      publishedBlogCount,
      featuredProjectCount,
      unreadMessageCount,
    ] = await Promise.all([
      Project.countDocuments(),
      BlogPost.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Message.countDocuments(),
      Achievement.countDocuments(),
      Research.countDocuments(),
      BlogPost.countDocuments({ published: true }),
      Project.countDocuments({ featured: true }),
      Message.countDocuments({ read: false }),
    ]);

    return {
      projectCount,
      blogCount,
      skillCount,
      experienceCount,
      messageCount,
      achievementCount,
      researchCount,
      publishedBlogCount,
      featuredProjectCount,
      unreadMessageCount,
    };
  } catch (error) {
    console.error('⚠️ Dashboard stats failed:', error);
    return {
      projectCount: 0,
      blogCount: 0,
      skillCount: 0,
      experienceCount: 0,
      messageCount: 0,
      achievementCount: 0,
      researchCount: 0,
      publishedBlogCount: 0,
      featuredProjectCount: 0,
      unreadMessageCount: 0,
      dbError: true,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projectCount,
      subtitle: `${stats.featuredProjectCount} featured`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      color: 'blue',
    },
    {
      title: 'Blog Posts',
      value: stats.blogCount,
      subtitle: `${stats.publishedBlogCount} published`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      color: 'green',
    },
    {
      title: 'Messages',
      value: stats.messageCount,
      subtitle: `${stats.unreadMessageCount} unread`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'purple',
    },
    {
      title: 'Skills',
      value: stats.skillCount,
      subtitle: 'Across all categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      color: 'yellow',
    },
    {
      title: 'Experience',
      value: stats.experienceCount,
      subtitle: 'Items',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'indigo',
    },
    {
      title: 'Achievements',
      value: stats.achievementCount,
      subtitle: 'Milestones',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'pink',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Database Error Banner */}
      {'dbError' in stats && stats.dbError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Database Connection Issue</h3>
              <p className="text-red-300/80 text-sm">
                Cannot connect to MongoDB Atlas. Check your IP whitelist at{' '}
                <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-300">
                  cloud.mongodb.com
                </a>
                {' '}→ Network Access → Add Current IP Address
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  colorClasses[stat.color as keyof typeof colorClasses]
                } border`}
              >
                {stat.icon}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-slate-500 text-sm">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/projects/new"
            className="flex items-center space-x-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-white font-medium">New Project</span>
          </a>

          <a
            href="/admin/blog/new"
            className="flex items-center space-x-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-white font-medium">New Blog Post</span>
          </a>

          <a
            href="/admin/messages"
            className="flex items-center space-x-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-white font-medium">View Messages</span>
          </a>

          <a
            href="/admin/site-settings"
            className="flex items-center space-x-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
            </div>
            <span className="text-white font-medium">Site Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}
