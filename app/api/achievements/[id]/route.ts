import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth-helpers';

function normalizeAchievementInput(body: any) {
  const type = body.type || body.category;
  const imageUrl = body.imageUrl || body.badge;

  return {
    ...body,
    ...(type !== undefined ? { type, category: body.category || type } : {}),
    ...(imageUrl !== undefined ? { imageUrl, badge: body.badge || imageUrl } : {}),
    ...(body.verified !== undefined ? { verified: Boolean(body.verified) } : {}),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid achievement ID' },
        { status: 400 }
      );
    }

    const achievement = await Achievement.findById(id).lean();

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: normalizeAchievementOutput(achievement) });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievement' },
      { status: 500 }
    );
  }
}

async function updateAchievement(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid achievement ID' },
        { status: 400 }
      );
    }

    const body = normalizeAchievementInput(await request.json());
    const achievement = await Achievement.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, data: normalizeAchievementOutput(achievement) });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateAchievement(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateAchievement(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid achievement ID' },
        { status: 400 }
      );
    }

    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: achievement,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}
