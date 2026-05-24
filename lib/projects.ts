import connectDB from './mongodb';
import Project from '@/models/Project';

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug }).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs() {
  await connectDB();
  const projects = await Project.find({}, 'slug').lean();
  return projects.map((p: any) => p.slug);
}

/**
 * Get related projects (same category, excluding current)
 */
export async function getRelatedProjects(slug: string, category: string, limit = 3) {
  await connectDB();
  const projects = await Project.find({
    slug: { $ne: slug },
    category: category,
  })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(projects));
}
