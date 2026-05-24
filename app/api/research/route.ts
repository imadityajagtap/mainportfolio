import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Research from '@/models/Research';
import { requireAuth } from '@/lib/auth-helpers';
import { apiSuccess, apiErrors } from '@/lib/api-response';

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeResearchInput(body: any) {
  const publishedDate = body.publishedDate || body.date || new Date();

  return {
    ...body,
    type: body.type || 'Research',
    publishedDate,
    date: body.date || publishedDate,
    authors: toArray(body.authors),
    tags: toArray(body.tags),
    readTime: body.readTime ? Number(body.readTime) : undefined,
    featured: Boolean(body.featured),
  };
}

function normalizeResearchOutput(item: any) {
  return {
    ...item,
    type: item.type || 'Research',
    publishedDate: item.publishedDate || item.date || item.createdAt,
    authors: Array.isArray(item.authors) ? item.authors : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    featured: Boolean(item.featured),
  };
}

/**
 * GET /api/research
 * Fetches all research papers
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || '-publishedDate';

    let query = Research.find();
    query = query.sort(sort);

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const research = (await query.lean().exec()).map(normalizeResearchOutput);

    return apiSuccess(research);
  } catch (error) {
    console.error('[api/research] GET error:', error);
    return apiErrors.mongoError(error);
  }
}

/**
 * POST /api/research
 * Creates a new research paper
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = normalizeResearchInput(await request.json());

    if (!body.title) {
      return apiErrors.badRequest('Title is required');
    }

    const research = await Research.create(body);

    // Revalidate homepage to show new research
    revalidatePath('/');

    return NextResponse.json({ ok: true, data: normalizeResearchOutput(research.toObject()) }, { status: 201 });
  } catch (error) {
    console.error('[api/research] POST error:', error);
    return apiErrors.mongoError(error);
  }
}
