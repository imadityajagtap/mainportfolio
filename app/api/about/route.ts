import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import About from '@/models/About';
import { requireAuth } from '@/lib/auth-helpers';
import { apiSuccess, apiErrors } from '@/lib/api-response';

function normalizeAboutInput(body: any) {
  return {
    ...body,
    photo: body.photo || body.profileImage || '',
  };
}

/**
 * GET /api/about
 * Fetches about data (creates with defaults if doesn't exist)
 */
export async function GET() {
  try {
    await connectDB();

    let about = await About.findOne();

    // Create default about data if none exists
    if (!about) {
      about = await About.create({});
    }

    return apiSuccess(about);
  } catch (error) {
    console.error('[api/about] GET error:', error);
    return apiErrors.mongoError(error);
  }
}

/**
 * Shared update logic for both POST and PUT
 */
async function updateAbout(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = normalizeAboutInput(await request.json());

    // Validate profile image URL if provided
    if (body.photo && body.photo.trim()) {
      try {
        new URL(body.photo);
      } catch {
        return apiErrors.badRequest('Invalid profile image URL format');
      }
    }

    // Upsert: update if exists, create if doesn't
    const about = await About.findOneAndUpdate(
      {}, // Empty filter matches the first/only document
      body,
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true, // Run schema validation
      }
    );

    // Revalidate homepage to show updated about info
    revalidatePath('/');

    return apiSuccess(about);
  } catch (error) {
    console.error('[api/about] Update error:', error);
    return apiErrors.mongoError(error);
  }
}

/**
 * POST /api/about
 * Updates about data (upsert)
 * Requires authentication
 */
export async function POST(request: Request) {
  return updateAbout(request);
}

/**
 * PUT /api/about
 * Updates about data (upsert)
 * Requires authentication
 */
export async function PUT(request: Request) {
  return updateAbout(request);
}
