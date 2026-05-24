import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/skills
 * Fetches all skills with optional filtering
 * Query params: ?category=Financial&limit=10&sort=order
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || 'order';

    // Build query filter
    const filter: any = {};
    if (category) {
      filter.category = category;
    }

    // Build query
    let query = Skill.find(filter);

    // Apply sorting
    query = query.sort(sort);

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const skills = await query.exec();

    return NextResponse.json({
      success: true,
      data: skills,
      count: skills.length,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch skills',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/skills
 * Creates a new skill
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
    if (!body.category || !body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category and name are required',
        },
        { status: 400 }
      );
    }

    const skill = await Skill.create(body);

    return NextResponse.json(
      {
        success: true,
        data: skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create skill',
      },
      { status: 500 }
    );
  }
}
