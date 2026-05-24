import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

/**
 * Temporary migration route to add slugs to existing blog posts
 * GET /api/migrate-slugs
 */
export async function GET() {
  try {
    await connectDB();

    // Find posts without slugs or with empty slugs
    const posts = await BlogPost.find({
      $or: [
        { slug: { $exists: false } },
        { slug: '' },
        { slug: null },
      ],
    });

    let updated = 0;
    const results = [];

    for (const post of posts) {
      if (!post.title) {
        results.push({
          _id: post._id,
          status: 'skipped',
          reason: 'No title available',
        });
        continue;
      }

      // Generate slug from title
      const slug = post.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingPost = await BlogPost.findOne({ slug, _id: { $ne: post._id } });
      const finalSlug = existingPost ? `${slug}-${post._id.toString().slice(-4)}` : slug;

      post.slug = finalSlug;
      await post.save();

      updated++;
      results.push({
        _id: post._id,
        title: post.title,
        slug: finalSlug,
        status: 'updated',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} posts with slugs`,
      total: posts.length,
      updated,
      results,
    });
  } catch (error) {
    console.error('Error migrating slugs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to migrate slugs',
      },
      { status: 500 }
    );
  }
}
