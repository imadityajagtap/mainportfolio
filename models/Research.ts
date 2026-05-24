import mongoose, { Document, Schema } from 'mongoose';

export interface IResearch extends Document {
  title: string;
  abstract: string;
  type: string;
  publishedDate: Date;
  authors: string[];
  pdfUrl: string;
  externalUrl: string;
  tags: string[];
  coverImage: string;
  readTime?: number;
  featured: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchSchema = new Schema<IResearch>(
  {
    title: {
      type: String,
      required: [true, 'Research title is required'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
    },
    type: {
      type: String,
      default: 'Research',
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    authors: {
      type: [String],
      default: [],
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    externalUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    readTime: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ResearchSchema.pre('validate', function syncResearchDates() {
  if (!this.publishedDate && this.date) {
    this.publishedDate = this.date;
  }
  if (!this.date && this.publishedDate) {
    this.date = this.publishedDate;
  }
});

// Index for sorting by publication date
ResearchSchema.index({ publishedDate: -1 });
ResearchSchema.index({ date: -1 });

export default mongoose.models.Research ||
  mongoose.model<IResearch>('Research', ResearchSchema);
