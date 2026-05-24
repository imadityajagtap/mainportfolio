import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { requireAuth } from '@/lib/auth-helpers';

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeExperienceInput(body: any) {
  const company = body.company || body.organization || body.companyName || '';
  const role = body.role || body.position || body.jobTitle || body.title || '';

  return {
    ...body,
    company,
    role,
    organization: body.organization || company,
    title: body.title || role,
    achievements: toArray(body.achievements),
    skills: toArray(body.skills),
    endDate: body.current ? null : body.endDate || null,
    current: Boolean(body.current),
  };
}

function normalizeExperienceOutput(item: any) {
  const company = item.company || item.organization || item.companyName || '';
  const role = item.role || item.position || item.jobTitle || item.title || '';

  return {
    ...item,
    company,
    role,
    organization: item.organization || company,
    title: item.title || role,
    achievements: Array.isArray(item.achievements) ? item.achievements : [],
    skills: Array.isArray(item.skills) ? item.skills : [],
  };
}

/**
 * GET /api/experience
 * Fetches all experience items
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || '-startDate';

    let query = Experience.find();
    query = query.sort(sort);

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const experience = (await query.lean().exec()).map(normalizeExperienceOutput);

    return NextResponse.json({
      success: true,
      data: experience,
      count: experience.length,
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch experience',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experience
 * Creates a new experience item
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = normalizeExperienceInput(await request.json());

    if (!body.role || !body.company) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company and role are required',
        },
        { status: 400 }
      );
    }

    const experience = await Experience.create(body);

    revalidatePath('/');

    return NextResponse.json(
      {
        success: true,
        data: normalizeExperienceOutput(experience.toObject()),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create experience',
      },
      { status: 500 }
    );
  }
}
