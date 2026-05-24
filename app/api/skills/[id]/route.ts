import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/skills/[id]
 * Fetches a single skill by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid skill ID',
        },
        { status: 400 }
      );
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch skill',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/skills/[id]
 * Updates a skill
 * Requires authentication
 */
export async function PUT(
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
        {
          success: false,
          error: 'Invalid skill ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const skill = await Skill.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update skill',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/skills/[id]
 * Deletes a skill
 * Requires authentication
 */
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
        {
          success: false,
          error: 'Invalid skill ID',
        },
        { status: 400 }
      );
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete skill',
      },
      { status: 500 }
    );
  }
}
