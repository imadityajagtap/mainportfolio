import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  // HERO
  heroGreeting: string;
  heroName: string;
  heroTagline: string;
  heroSubtitle: string;
  heroLabel: string;
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

  // CONTACT INFO
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  contactHeading: string;
  contactSubtitle: string;
  contactResponseTime: string;
  calendlyLink: string;

  // SOCIAL LINKS
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  websiteUrl: string;

  // FOOTER
  footerTagline: string;
  footerLocation: string;
  copyrightText: string;
  logoInitials: string;

  // SECTION HEADINGS
  aboutLabel: string;
  aboutHeading: string;
  aboutSubtitle: string;

  skillsLabel: string;
  skillsHeading: string;
  skillsSubtitle: string;

  projectsLabel: string;
  projectsHeading: string;
  projectsSubtitle: string;

  experienceLabel: string;
  experienceHeading: string;
  experienceSubtitle: string;

  researchLabel: string;
  researchHeading: string;
  researchSubtitle: string;

  achievementsLabel: string;
  achievementsHeading: string;
  achievementsSubtitle: string;

  blogLabel: string;
  blogHeading: string;
  blogSubtitle: string;

  // RESUME
  resumeUrl: string;
  resumeLabel: string;
  resumeUpdatedAt?: Date | null;

  // SEO
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  favicon: string;

  // LEGACY (keep for backwards compatibility)
  contactHeadline: string;
  location: string;
  footerText: string;
  socialLinks: {
    linkedin?: string;
    email?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    // HERO
    heroGreeting: {
      type: String,
      default: "Hi, I'm Aditya 👋",
    },
    heroName: {
      type: String,
      default: 'Aditya Jagtap',
    },
    heroTagline: {
      type: String,
      default: 'Decoding business, one framework at a time.',
    },
    heroSubtitle: {
      type: String,
      default: 'Turning complex problems into actionable strategies through data-driven insights.',
    },
    heroLabel: {
      type: String,
      default: 'MBA Candidate · Finance × Strategy × Consulting',
    },
    heroPhoto: {
      type: String,
      default: '',
    },
    tickerText: {
      type: [String],
      default: ['AAPL +2.3%', 'TSLA -1.2%', 'ADITYA +∞%', 'GOOGL +1.8%', 'MSFT +0.9%'],
    },
    ctaPrimary: {
      text: {
        type: String,
        default: 'View Case Studies',
      },
      link: {
        type: String,
        default: '#projects',
      },
    },
    ctaSecondary: {
      text: {
        type: String,
        default: 'Download Resume',
      },
      link: {
        type: String,
        default: '#resume',
      },
    },

    // CONTACT INFO
    contactEmail: {
      type: String,
      default: 'aditya@example.com',
    },
    contactPhone: {
      type: String,
      default: '+91 XXXXX XXXXX',
    },
    contactLocation: {
      type: String,
      default: 'Mumbai, India',
    },
    contactHeading: {
      type: String,
      default: "Let's build something remarkable",
    },
    contactSubtitle: {
      type: String,
      default: "Whether you're a recruiter, collaborator, or just want to chat about markets — my inbox is open.",
    },
    contactResponseTime: {
      type: String,
      default: 'Usually responds within 24 hours',
    },
    calendlyLink: {
      type: String,
      default: '',
    },

    // SOCIAL LINKS
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com/in/aditya-jagtap',
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/aditya-jagtap',
    },
    twitterUrl: {
      type: String,
      default: 'https://twitter.com/aditya_jagtap',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    websiteUrl: {
      type: String,
      default: '',
    },

    // FOOTER
    footerTagline: {
      type: String,
      default: 'Finance meets strategy. Numbers meet stories.',
    },
    footerLocation: {
      type: String,
      default: 'Based in Mumbai · Open to opportunities worldwide',
    },
    copyrightText: {
      type: String,
      default: '© 2026 Aditya Jagtap · All rights reserved',
    },
    logoInitials: {
      type: String,
      default: 'AJ',
    },

    // SECTION HEADINGS
    aboutLabel: {
      type: String,
      default: '02 / ABOUT',
    },
    aboutHeading: {
      type: String,
      default: 'Bridging finance with strategy',
    },
    aboutSubtitle: {
      type: String,
      default: 'Analytical thinking meets creative problem-solving',
    },

    skillsLabel: {
      type: String,
      default: '03 / SKILLS',
    },
    skillsHeading: {
      type: String,
      default: 'Tools of the trade',
    },
    skillsSubtitle: {
      type: String,
      default: 'From Excel to Python, here\'s what I work with',
    },

    projectsLabel: {
      type: String,
      default: '04 / SELECTED WORK',
    },
    projectsHeading: {
      type: String,
      default: 'Projects that tell a story',
    },
    projectsSubtitle: {
      type: String,
      default: 'Real problems. Real analysis. Real impact.',
    },

    experienceLabel: {
      type: String,
      default: '05 / EXPERIENCE',
    },
    experienceHeading: {
      type: String,
      default: "Where I've made an impact",
    },
    experienceSubtitle: {
      type: String,
      default: 'A journey through internships, leadership roles, and real-world problem-solving',
    },

    researchLabel: {
      type: String,
      default: '06 / RESEARCH',
    },
    researchHeading: {
      type: String,
      default: 'Thinking deeply about markets',
    },
    researchSubtitle: {
      type: String,
      default: 'Research papers, whitepapers, and analytical deep-dives',
    },

    achievementsLabel: {
      type: String,
      default: '07 / ACHIEVEMENTS',
    },
    achievementsHeading: {
      type: String,
      default: 'Recognition and milestones',
    },
    achievementsSubtitle: {
      type: String,
      default: 'Awards, certifications, and competitive wins',
    },

    blogLabel: {
      type: String,
      default: '08 / BLOG',
    },
    blogHeading: {
      type: String,
      default: 'Insights and essays',
    },
    blogSubtitle: {
      type: String,
      default: 'Thoughts on finance, strategy, and markets',
    },

    // RESUME
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeLabel: {
      type: String,
      default: 'Download Resume',
    },
    resumeUpdatedAt: {
      type: Date,
      default: null,
    },

    // SEO
    siteTitle: {
      type: String,
      default: 'Aditya Jagtap — Strategy & Finance Portfolio',
    },
    siteDescription: {
      type: String,
      default: 'Personal portfolio showcasing strategic analysis, financial modeling, and business insights.',
    },
    ogImage: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '/favicon.ico',
    },

    // LEGACY (keep for backwards compatibility)
    contactHeadline: {
      type: String,
      default: "Let's build something together",
    },
    location: {
      type: String,
      default: 'Mumbai, India',
    },
    footerText: {
      type: String,
      default: '© 2026 Aditya Jagtap. Built with Next.js.',
    },
    socialLinks: {
      linkedin: String,
      email: String,
      twitter: String,
      instagram: String,
      github: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
