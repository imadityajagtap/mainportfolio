import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
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

    const existing = await Project.findOne(filter);
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * GET /api/projects
 * Fetches all projects with optional filtering
 * Query params: ?featured=true&category=Strategy&limit=10&sort=-createdAt
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query filter
    const filter: any = {};
    if (featured === 'true') {
      filter.featured = true;
    }
    if (category) {
      filter.category = category;
    }

    // Build query
    let query = Project.find(filter);

    // Apply sorting
    query = query.sort(sort);

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const projects = await query.exec();

    return NextResponse.json(
      {
        success: true,
        data: projects,
        count: projects.length,
      },
      {
        headers: {
          // ✅ Cache for 60s, stale-while-revalidate for 2 min
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Creates a new project with auto-generated slug if not provided
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

    const project = await Project.create(body);

    // ✅ Revalidate pages that display projects
    revalidatePath('/'); // Homepage projects section
    revalidatePath('/projects'); // Projects list page
    revalidatePath(`/projects/${project.slug}`); // New project detail page

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create project',
      },
      { status: 500 }
    );
  }
}
