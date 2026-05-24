import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/projects/[slug]
 * Fetch a single project by slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const project = mongoose.Types.ObjectId.isValid(slug)
      ? await Project.findById(slug).lean()
      : await Project.findOne({ slug }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(project)),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[slug]
 * Updates a project by slug
 * Requires authentication
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { slug } = await params;
    const body = await request.json();

    const project = await Project.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // ✅ Revalidate pages after update
    revalidatePath('/'); // Homepage
    revalidatePath('/projects'); // Projects list
    revalidatePath(`/projects/${slug}`); // This project's detail page
    revalidatePath(`/projects/${project.slug}`); // In case slug changed

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]
 * Updates a project by MongoDB ObjectId
 * Requires authentication
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const { slug: id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project id' },
        { status: 400 }
      );
    }

    await connectDB();
    const payload = await request.json();

    const project = await Project.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[slug]
 * Deletes a project by slug
 * Requires authentication
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { slug } = await params;

    const project = mongoose.Types.ObjectId.isValid(slug)
      ? await Project.findByIdAndDelete(slug)
      : await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // ✅ Revalidate pages after delete
    revalidatePath('/'); // Homepage
    revalidatePath('/projects'); // Projects list
    revalidatePath(`/projects/${slug}`); // The deleted project page (will 404)

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
