import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import { requireAuth } from '@/lib/auth-helpers';

function normalizeAchievementInput(body: any) {
  const type = body.type || body.category || 'Award';
  const imageUrl = body.imageUrl || body.badge || '';

  return {
    ...body,
    type,
    category: body.category || type,
    imageUrl,
    badge: body.badge || imageUrl,
    verified: Boolean(body.verified),
  };
}

function normalizeAchievementOutput(item: any) {
  const type = item.type || item.category || 'Award';
  const imageUrl = item.imageUrl || item.badge || '';

  return {
    ...item,
    type,
    category: item.category || type,
    imageUrl,
    badge: item.badge || imageUrl,
    verified: Boolean(item.verified),
  };
}

/**
 * GET /api/achievements
 * Fetches all achievements
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || '-date';

    let query = Achievement.find();
    query = query.sort(sort);

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const achievements = (await query.lean().exec()).map(normalizeAchievementOutput);

    return NextResponse.json({
      success: true,
      data: achievements,
      count: achievements.length,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch achievements',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/achievements
 * Creates a new achievement
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = normalizeAchievementInput(await request.json());

    if (!body.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    const achievement = await Achievement.create(body);

    revalidatePath('/');

    return NextResponse.json(
      {
        success: true,
        data: normalizeAchievementOutput(achievement.toObject()),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create achievement',
      },
      { status: 500 }
    );
  }
}
