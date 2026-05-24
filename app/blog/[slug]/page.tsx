import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogHero from '@/components/public/blog-detail/BlogHero';
import BlogContent from '@/components/public/blog-detail/BlogContent';
import BlogFooter from '@/components/public/blog-detail/BlogFooter';
import RelatedPosts from '@/components/public/blog-detail/RelatedPosts';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedDate: string;
  readTime?: number;
  published?: boolean;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Fetch blog post by slug
 */
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Aditya Jagtap',
    };
  }

  return {
    title: `${post.title || 'Blog Post'} | Aditya Jagtap`,
    description: post.excerpt || 'Read this blog post on markets, strategy, and finance.',
    openGraph: {
      title: post.title || 'Blog Post',
      description: post.excerpt || '',
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

/**
 * Blog detail page
 */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <BlogHero post={post} />
      <BlogContent post={post} />
      <BlogFooter post={post} />
      <RelatedPosts currentSlug={slug} category={post.category} />
    </article>
  );
}
