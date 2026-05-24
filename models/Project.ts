import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  coverImage: string;
  tags: string[];
  category: 'Strategy' | 'Finance' | 'Consulting' | 'Research' | 'Academic';
  hook: string;
  impactMetric: string;
  problemStatement: string;
  approach: string;
  analysis: string;
  recommendations: string;
  results: string;
  images: string[];
  duration: string;
  role: string;
  year?: number;
  client: string;
  tools: string[];
  pdfUrl: string;
  externalLinks: Array<{
    label: string;
    url: string;
  }>;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Strategy', 'Finance', 'Consulting', 'Research', 'Academic'],
        message: '{VALUE} is not a valid category',
      },
    },
    hook: {
      type: String,
      default: '',
      trim: true,
    },
    impactMetric: {
      type: String,
      default: '',
      trim: true,
    },
    problemStatement: {
      type: String,
      default: '',
    },
    approach: {
      type: String,
      default: '',
    },
    analysis: {
      type: String,
      default: '',
    },
    recommendations: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: Number,
    },
    client: {
      type: String,
      default: '',
      trim: true,
    },
    tools: {
      type: [String],
      default: [],
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    externalLinks: {
      type: [
        {
          label: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ category: 1, order: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.models.Project ||
  mongoose.model<IProject>('Project', ProjectSchema);
