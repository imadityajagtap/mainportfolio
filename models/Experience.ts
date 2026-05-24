import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  type: 'Internship' | 'Leadership' | 'Competition' | 'Certification' | 'Full-time' | 'Freelance';
  company: string;
  role: string;
  title?: string;
  organization?: string;
  location?: string;
  logo: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
  achievements: string[];
  skills?: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    type: {
      type: String,
      required: [true, 'Experience type is required'],
      enum: {
        values: ['Internship', 'Leadership', 'Competition', 'Certification', 'Full-time', 'Freelance'],
        message: '{VALUE} is not a valid experience type',
      },
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    // Legacy fields kept so older admin/public code and existing documents remain readable.
    title: {
      type: String,
      default: '',
      trim: true,
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: null,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    achievements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
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

ExperienceSchema.pre('validate', function syncExperienceAliases() {
  if (!this.company && this.organization) {
    this.company = this.organization;
  }
  if (!this.role && this.title) {
    this.role = this.title;
  }
  if (!this.organization && this.company) {
    this.organization = this.company;
  }
  if (!this.title && this.role) {
    this.title = this.role;
  }
});

// Index for sorting
ExperienceSchema.index({ type: 1, order: 1 });
ExperienceSchema.index({ startDate: -1 });

export default mongoose.models.Experience ||
  mongoose.model<IExperience>('Experience', ExperienceSchema);
