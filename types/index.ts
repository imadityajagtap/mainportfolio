// Clean TypeScript interfaces for frontend use (without Mongoose Document)

export interface ISiteSettings {
  _id: string;
  heroGreeting: string;
  heroTagline: string;
  heroSubtitle: string;
  heroPhoto: string;
  tickerText: string[];
  ctaPrimary: {
    text: string;
    link: string;
  };
  ctaSecondary: {
    text: string;
    link: string;
  };
  siteTitle: string;
  siteDescription: string;
  socialLinks: {
    linkedin?: string;
    email?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
  contactHeadline: string;
  location: string;
  calendlyLink: string;
  footerText: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAbout {
  _id: string;
  bio: string;
  photo: string;
  philosophyQuote: string;
  currentlyReading: string;
  currentlyLearning: string;
  funFacts: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ISkill {
  _id: string;
  category: string; // Allow any custom category
  name: string;
  icon: string;
  proficiency: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  tags: string[];
  category: 'Strategy' | 'Finance' | 'Consulting' | 'Research' | 'Academic';
  hook: string;
  impactMetric: string;
  problemStatement: string;
  approach: string;
  analysis: string;
  recommendations: string;
  results: string;
  images: string[];
  duration: string;
  role: string;
  year?: number;
  client: string;
  tools: string[];
  pdfUrl: string;
  externalLinks: Array<{
    label: string;
    url: string;
  }>;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IResearch {
  _id: string;
  title: string;
  abstract: string;
  type: string;
  publishedDate: string;
  authors: string[];
  pdfUrl: string;
  externalUrl: string;
  tags: string[];
  coverImage: string;
  readTime?: number;
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExperience {
  _id: string;
  type: 'Internship' | 'Leadership' | 'Competition' | 'Certification' | 'Full-time' | 'Freelance';
  company: string;
  role: string;
  title?: string;
  organization?: string;
  logo: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  location?: string;
  description: string;
  achievements: string[];
  skills?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAchievement {
  _id: string;
  title: string;
  issuer: string;
  description: string;
  credentialUrl: string;
  imageUrl: string;
  type: string;
  rank: string;
  verified: boolean;
  badge: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  category: 'Market Analysis' | 'Strategy' | 'Book Review' | 'Career Tips';
  tags: string[];
  published: boolean;
  publishDate: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
