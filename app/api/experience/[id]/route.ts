import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';
import mongoose from 'mongoose';
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
  const company = body.company || body.organization || body.companyName;
  const role = body.role || body.position || body.jobTitle || body.title;

  return {
    ...body,
    ...(company !== undefined ? { company, organization: body.organization || company } : {}),
    ...(role !== undefined ? { role, title: body.title || role } : {}),
    ...(body.achievements !== undefined ? { achievements: toArray(body.achievements) } : {}),
    ...(body.skills !== undefined ? { skills: toArray(body.skills) } : {}),
    ...(body.current !== undefined ? { current: Boolean(body.current) } : {}),
    ...(body.current !== undefined || body.endDate !== undefined
      ? { endDate: body.current ? null : body.endDate || null }
      : {}),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    const experience = await Experience.findById(id).lean();

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: normalizeExperienceOutput(experience) });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

async function updateExperience(
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
        { success: false, error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    const body = normalizeExperienceInput(await request.json());
    const experience = await Experience.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    revalidatePath('/');

    return NextResponse.json({ success: true, data: normalizeExperienceOutput(experience) });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateExperience(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateExperience(request, { params });
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
        { success: false, error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
