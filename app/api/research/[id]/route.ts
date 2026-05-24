import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Research from '@/models/Research';
import mongoose from 'mongoose';
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
  const publishedDate = body.publishedDate || body.date;

  return {
    ...body,
    ...(publishedDate ? { publishedDate, date: body.date || publishedDate } : {}),
    ...(body.type ? { type: body.type } : {}),
    ...(body.authors !== undefined ? { authors: toArray(body.authors) } : {}),
    ...(body.tags !== undefined ? { tags: toArray(body.tags) } : {}),
    ...(body.readTime !== undefined ? { readTime: body.readTime ? Number(body.readTime) : undefined } : {}),
    ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiErrors.invalidId();
    }

    const research = await Research.findById(id).lean();

    if (!research) {
      return apiErrors.notFound('Research');
    }

    return apiSuccess(normalizeResearchOutput(research));
  } catch (error) {
    console.error('[api/research/[id]] GET error:', error);
    return apiErrors.mongoError(error);
  }
}

async function updateResearch(
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
      return apiErrors.invalidId();
    }

    const body = normalizeResearchInput(await request.json());
    const research = await Research.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!research) {
      return apiErrors.notFound('Research');
    }

    // Revalidate homepage to show updated research
    revalidatePath('/');

    return apiSuccess(normalizeResearchOutput(research));
  } catch (error) {
    console.error('[api/research/[id]] Update error:', error);
    return apiErrors.mongoError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateResearch(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateResearch(request, { params });
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
      return apiErrors.invalidId();
    }

    const research = await Research.findByIdAndDelete(id);

    if (!research) {
      return apiErrors.notFound('Research');
    }

    // Revalidate homepage to reflect deletion
    revalidatePath('/');

    return apiSuccess(research);
  } catch (error) {
    console.error('[api/research/[id]] DELETE error:', error);
    return apiErrors.mongoError(error);
  }
}
