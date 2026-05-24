import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  category: 'Finance' | 'Strategy' | 'Consulting' | 'Markets' | 'Frameworks' | 'Personal' | 'Market Analysis' | 'Book Review' | 'Career Tips';
  tags: string[];
  author?: string;
  readTime?: number;
  published: boolean;
  publishDate: Date;
  featured?: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Finance', 'Strategy', 'Consulting', 'Markets', 'Frameworks', 'Personal', 'Market Analysis', 'Book Review', 'Career Tips'],
        message: '{VALUE} is not a valid category',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: 'Aditya Jagtap',
      trim: true,
    },
    readTime: {
      type: Number,
      default: 5,
      min: 1,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ published: 1, publishDate: -1 });
BlogPostSchema.index({ category: 1, published: 1 });

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
