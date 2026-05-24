import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Ensures slug is unique by appending number if needed
 */
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const filter: any = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await BlogPost.findOne(filter);
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * GET /api/blog
 * Fetches all blog posts with optional filtering
 * Query params: ?published=true&category=Strategy&limit=10&sort=-publishDate
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || '-publishDate';

    // Build query filter
    const filter: any = {};
    if (published === 'true') {
      filter.published = true;
    }
    if (category) {
      filter.category = category;
    }

    // Build query
    let query = BlogPost.find(filter);

    // Apply sorting
    query = query.sort(sort);

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const posts = await query.exec();

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog
 * Creates a new blog post with auto-generated slug if not provided
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      const baseSlug = generateSlug(body.title);
      body.slug = await ensureUniqueSlug(baseSlug);
    } else {
      // Ensure provided slug is unique
      body.slug = await ensureUniqueSlug(generateSlug(body.slug));
    }

    const post = await BlogPost.create(body);

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create blog post',
      },
      { status: 500 }
    );
  }
}
