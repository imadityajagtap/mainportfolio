import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { requireAuth } from '@/lib/auth-helpers';

/**
 * GET /api/site-settings
 * Fetches site settings (creates with defaults if doesn't exist)
 */
export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      {
        headers: {
          // ✅ Settings change rarely, cache for 5 min
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch site settings',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/site-settings
 * Updates site settings (upsert)
 * Requires authentication
 */
export async function PUT(request: Request) {
  try {
    // Check authentication
    const authError = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = await request.json();

    // Upsert: update if exists, create if doesn't
    const settings = await SiteSettings.findOneAndUpdate(
      {}, // Empty filter matches the first/only document
      body,
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true, // Run schema validation
      }
    );

    // ✅ CRITICAL: Revalidate all pages that use settings
    revalidatePath('/', 'layout'); // Revalidates entire app including all nested pages
    revalidatePath('/(public)'); // Explicitly revalidate public routes

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update site settings',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/site-settings
 * Alias for PUT (partial update of site settings)
 * Requires authentication
 */
export async function PATCH(request: Request) {
  return PUT(request);
}
