import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const SiteSettings = (await import('../models/SiteSettings')).default;
  const About = (await import('../models/About')).default;
  const Skill = (await import('../models/Skill')).default;
  const Project = (await import('../models/Project')).default;
  const Research = (await import('../models/Research')).default;
  const Experience = (await import('../models/Experience')).default;
  const Achievement = (await import('../models/Achievement')).default;
  const BlogPost = (await import('../models/BlogPost')).default;

  console.log('🌱 Starting database seeding...\n');

  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      SiteSettings.deleteMany({}),
      About.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Research.deleteMany({}),
      Experience.deleteMany({}),
      Achievement.deleteMany({}),
      BlogPost.deleteMany({}),
    ]);

    // 1. Seed Site Settings
    console.log('⚙️  Creating site settings...');
    await SiteSettings.create({
      heroGreeting: "Hi, I'm Aditya 👋",
      heroTagline: 'Decoding business, one framework at a time.',
      heroSubtitle: 'MBA student exploring the intersection of finance, strategy, and innovation.',
      tickerText: ['NIFTY +1.5%', 'SENSEX +2.3%', 'PORTFOLIO +∞%'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/adityajagtap',
        email: 'adityajagtap312@gmail.com',
        github: 'https://github.com/adityajagtap',
      },
      location: 'Mumbai, India',
    });

    // 2. Seed About
    console.log('👤 Creating about data...');
    await About.create({
      bio: "I'm an MBA student passionate about strategic analysis, financial modeling, and business innovation. With a background in finance and consulting, I enjoy solving complex business problems and creating data-driven insights.",
      philosophyQuote: 'The best way to predict the future is to invent it. - Alan Kay',
      currentlyReading: 'The Intelligent Investor by Benjamin Graham',
      currentlyLearning: 'Private Equity & Venture Capital Analysis',
      funFacts: [
        { icon: '☕', label: 'Coffee consumed', value: '500+' },
        { icon: '📚', label: 'Case studies analyzed', value: '100+' },
        { icon: '📈', label: 'Market research reports', value: '50+' },
        { icon: '👥', label: 'Team projects led', value: '15+' },
      ],
    });

    // 3. Seed Skills (8 skills - 2 per category)
    console.log('💪 Creating skills...');
    await Skill.insertMany([
      // Financial Skills
      { category: 'Financial', name: 'Financial Modeling', icon: 'Calculator', proficiency: 4, order: 1 },
      { category: 'Financial', name: 'Valuation Analysis', icon: 'TrendingUp', proficiency: 3, order: 2 },
      // Strategy Skills
      { category: 'Strategy', name: 'Business Strategy', icon: 'Target', proficiency: 4, order: 1 },
      { category: 'Strategy', name: 'Market Analysis', icon: 'BarChart', proficiency: 4, order: 2 },
      // Analytical Skills
      { category: 'Analytical', name: 'Excel & VBA', icon: 'Table', proficiency: 4, order: 1 },
      { category: 'Analytical', name: 'Data Visualization', icon: 'PieChart', proficiency: 3, order: 2 },
      // Soft Skills
      { category: 'Soft Skills', name: 'Leadership', icon: 'Users', proficiency: 4, order: 1 },
      { category: 'Soft Skills', name: 'Communication', icon: 'MessageSquare', proficiency: 4, order: 2 },
    ]);

    // 4. Seed Projects (3 projects - 1 featured)
    console.log('📁 Creating projects...');
    await Project.insertMany([
      {
        title: 'Electric Vehicle Market Entry Strategy',
        slug: 'ev-market-entry-strategy',
        category: 'Strategy',
        tags: ['Strategy', 'Market Analysis', 'Automotive'],
        hook: 'How should legacy automakers compete in the EV revolution?',
        impactMetric: 'Identified $2B market opportunity',
        problemStatement: 'Traditional automakers face disruption from EV-first companies like Tesla. How can they successfully transition and compete?',
        approach: 'Conducted comprehensive market analysis, competitive benchmarking, and developed a 5-year transition roadmap.',
        analysis: 'Analyzed market trends, consumer preferences, supply chain challenges, and competitive positioning of major players.',
        recommendations: 'Focus on mid-range segment, strategic partnerships with battery manufacturers, and phased transition plan.',
        results: 'Presented to leadership team, recommendations adopted for strategic planning cycle.',
        featured: true,
        order: 1,
      },
      {
        title: 'Private Equity Deal Analysis: SaaS Acquisition',
        slug: 'pe-deal-analysis-saas',
        category: 'Finance',
        tags: ['Private Equity', 'M&A', 'SaaS', 'Valuation'],
        hook: 'Analyzing a $50M acquisition opportunity in the B2B SaaS space',
        impactMetric: 'Recommended PASS on overvalued target',
        problemStatement: 'PE firm considering acquisition of mid-market SaaS company. Is the valuation justified?',
        approach: 'Built detailed financial model, conducted DCF and comparable analysis, assessed growth sustainability.',
        analysis: 'Target trading at 12x revenue vs. 8x industry average. High churn rate and declining unit economics.',
        recommendations: 'Pass on current terms. Target overvalued given churn concerns and competitive pressures.',
        results: 'Analysis prevented costly acquisition, firm avoided $15M in potential losses.',
        featured: false,
        order: 2,
      },
      {
        title: 'Digital Banking Strategy for Regional Bank',
        slug: 'digital-banking-strategy',
        category: 'Strategy',
        tags: ['Banking', 'Digital Transformation', 'FinTech'],
        hook: 'Helping traditional banks compete with digital-first challengers',
        impactMetric: '3x increase in mobile app adoption',
        problemStatement: 'Regional bank losing market share to digital banks. How to modernize without alienating existing customers?',
        approach: 'Customer segmentation analysis, competitive benchmarking, phased digital transformation roadmap.',
        analysis: 'Identified opportunity in underserved small business segment. Legacy systems limiting innovation.',
        recommendations: 'Launch separate digital brand targeting small businesses, modernize core banking platform.',
        results: 'Client launched pilot program, achieved 200% of customer acquisition targets in Q1.',
        featured: false,
        order: 3,
      },
    ]);

    // 5. Seed Research (2 papers)
    console.log('📚 Creating research papers...');
    await Research.insertMany([
      {
        title: 'Impact of ESG Factors on Stock Performance',
        abstract: 'This study examines the relationship between ESG scores and stock market performance across 500 companies over a 10-year period.',
        publication: 'Journal of Financial Research (Hypothetical)',
        publicationDate: new Date('2025-03-15'),
        authors: ['Aditya Jagtap', 'Co-Author Name'],
        keywords: ['ESG', 'Stock Performance', 'Sustainable Investing'],
        pdfUrl: '',
        externalLink: '',
      },
      {
        title: 'Disruption in the Automotive Industry: A Case Study Analysis',
        abstract: 'Analysis of how Tesla disrupted the automotive industry and lessons for incumbent players facing digital transformation.',
        publication: 'MBA Capstone Project',
        publicationDate: new Date('2025-12-10'),
        authors: ['Aditya Jagtap'],
        keywords: ['Disruption', 'Automotive', 'Innovation', 'Strategy'],
        pdfUrl: '',
        externalLink: '',
      },
    ]);

    // 6. Seed Experience (4 items - 1 of each type)
    console.log('💼 Creating experience...');
    await Experience.insertMany([
      {
        type: 'Internship',
        title: 'Investment Banking Summer Analyst',
        organization: 'Leading Investment Bank',
        startDate: 'May 2025',
        endDate: 'July 2025',
        description: 'M&A advisory and financial modeling for mid-market transactions in the financial services sector.',
        achievements: [
          'Built financial models for 3 successful M&A deals totaling $200M',
          'Prepared pitch decks and investor presentations for client meetings',
          'Conducted industry and company due diligence',
        ],
        order: 1,
      },
      {
        type: 'Leadership',
        title: 'Vice President',
        organization: 'MBA Consulting Club',
        startDate: 'Aug 2024',
        endDate: 'Present',
        description: 'Leading consulting club with 200+ members, organizing case competitions and industry events.',
        achievements: [
          'Organized National Case Competition with 50+ participating teams',
          'Secured sponsorships worth ₹5L from top consulting firms',
          'Conducted 15+ workshops on case interview preparation',
        ],
        order: 2,
      },
      {
        type: 'Competition',
        title: 'Winner - National Business Case Competition',
        organization: 'Premier B-School',
        startDate: 'Mar 2025',
        endDate: 'Mar 2025',
        description: 'First place among 100+ teams in prestigious national case competition.',
        achievements: [
          'Developed comprehensive market entry strategy for electric vehicles',
          'Presented to panel of industry leaders and investors',
          'Won ₹2L prize and consulting internship opportunity',
        ],
        order: 3,
      },
      {
        type: 'Certification',
        title: 'CFA Level 1 Candidate',
        organization: 'CFA Institute',
        startDate: 'Jan 2025',
        endDate: 'Jun 2025',
        description: 'Pursuing CFA Level 1 certification to deepen finance knowledge and analytical skills.',
        achievements: [
          'Completed 300+ hours of study',
          'Scored 90+ percentile on practice exams',
          'Focus areas: Equity Valuation, Corporate Finance',
        ],
        order: 4,
      },
    ]);

    // 7. Seed Achievements (3 items)
    console.log('🏆 Creating achievements...');
    await Achievement.insertMany([
      {
        title: 'Winner - National Business Case Competition',
        description: 'First place among 100+ teams in prestigious national case competition',
        date: new Date('2025-03-20'),
        icon: 'Trophy',
        category: 'Competition',
      },
      {
        title: 'Dean\'s List - All Semesters',
        description: 'Consistently maintained top 5% academic performance',
        date: new Date('2025-05-01'),
        icon: 'Award',
        category: 'Academic',
      },
      {
        title: 'Published Research Paper',
        description: 'Published research on ESG investing in peer-reviewed journal',
        date: new Date('2025-03-15'),
        icon: 'BookOpen',
        category: 'Research',
      },
    ]);

    // 8. Seed Blog Posts (2 posts - 1 published, 1 draft)
    console.log('📝 Creating blog posts...');
    await BlogPost.insertMany([
      {
        title: 'Why Every MBA Student Should Learn Financial Modeling',
        slug: 'why-learn-financial-modeling',
        category: 'Career Tips',
        tags: ['Finance', 'Career', 'Skills'],
        excerpt: 'Financial modeling is one of the most valuable skills you can develop during your MBA. Here\'s why...',
        content: `# Why Every MBA Student Should Learn Financial Modeling

Financial modeling is often seen as a niche skill reserved for investment bankers and private equity professionals. But I believe every MBA student, regardless of their career path, should invest time in learning this crucial skill.

## What is Financial Modeling?

Financial modeling is the process of creating a mathematical representation of a company's financial performance. It typically involves building spreadsheet models that forecast future revenue, expenses, and cash flows.

## Why It Matters

**1. Data-Driven Decision Making**
In today\'s business world, gut feelings aren\'t enough. Financial models help you quantify assumptions and test different scenarios.

**2. Universal Business Language**
Numbers are universal. Being able to build and interpret financial models makes you valuable in any industry.

**3. Career Opportunities**
Even if you\'re not pursuing finance, many consulting, strategy, and corporate development roles require modeling skills.

## Getting Started

Start with the basics: learn Excel formulas, understand financial statements, and practice building simple DCF models. Resources like YouTube, Coursera, and practice case studies are great starting points.

The investment in learning financial modeling pays dividends throughout your career. Start today!`,
        published: true,
        publishDate: new Date('2025-04-15'),
        viewCount: 250,
      },
      {
        title: 'The Future of FinTech in India',
        slug: 'future-of-fintech-india',
        category: 'Market Analysis',
        tags: ['FinTech', 'India', 'Technology'],
        excerpt: 'Exploring the explosive growth of financial technology in India and what it means for traditional banks...',
        content: `# The Future of FinTech in India

India's FinTech sector is experiencing unprecedented growth...

(Draft content - to be completed)`,
        published: false,
        publishDate: new Date('2025-05-10'),
        viewCount: 0,
      },
    ]);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 Site Settings document');
    console.log('   - 1 About document');
    console.log('   - 8 Skills');
    console.log('   - 3 Projects');
    console.log('   - 2 Research papers');
    console.log('   - 4 Experience items');
    console.log('   - 3 Achievements');
    console.log('   - 2 Blog posts');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.default.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
});
