import { notFound } from "next/navigation";
import { Metadata } from "next";
import { IProject } from "@/types";
import ProjectHero from "@/components/public/project-detail/ProjectHero";
import ProjectMeta from "@/components/public/project-detail/ProjectMeta";
import ProjectContent from "@/components/public/project-detail/ProjectContent";
import ProjectGallery from "@/components/public/project-detail/ProjectGallery";
import RelatedProjects from "@/components/public/project-detail/RelatedProjects";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Fetch project data from API - directly from database for SSG
 */
async function getProject(slug: string): Promise<IProject | null> {
  try {
    // Import directly for server-side rendering to avoid fetch issues
    const connectDB = (await import('@/lib/mongodb')).default;
    const Project = (await import('@/models/Project')).default;

    await connectDB();
    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      return null;
    }

    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Aditya Jagtap",
    };
  }

  return {
    title: `${project.title} | Aditya Jagtap`,
    description: project.hook || project.problemStatement,
    openGraph: {
      title: project.title,
      description: project.hook || project.problemStatement,
      images: project.coverImage ? [project.coverImage] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.hook || project.problemStatement,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

/**
 * Project Detail Page - Server Component
 * Full-width vertical layout with all sections stacked
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Metrics Strip */}
      <ProjectMeta
        impactMetric={project.impactMetric}
        duration={(project as any).duration}
        role={(project as any).role}
        tools={(project as any).tools}
      />

      {/* Main Content Sections */}
      <ProjectContent project={project} />

      {/* Project Gallery */}
      <ProjectGallery images={Array.isArray(project.images) ? project.images : []} />

      {/* Related Projects */}
      <RelatedProjects currentSlug={slug} category={project.category} />
    </div>
  );
}
