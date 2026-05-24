import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  subtitle: string;
  bio: string;
  photo: string;
  education: string[];
  experience: string[];
  certifications: string[];
  interests: string[];
  resumeUrl: string;
  philosophyQuote: string;
  currentlyReading: string;
  currentlyLearning: string;
  funFacts: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      default: 'About Aditya',
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: 'A passionate MBA student specializing in finance and strategy...',
    },
    photo: {
      type: String,
      default: '',
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    philosophyQuote: {
      type: String,
      default: 'The best way to predict the future is to invent it.',
    },
    currentlyReading: {
      type: String,
      default: 'Zero to One by Peter Thiel',
    },
    currentlyLearning: {
      type: String,
      default: 'Advanced Financial Modeling & Valuation',
    },
    funFacts: {
      type: [
        {
          icon: {
            type: String,
            required: true,
          },
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
      default: [
        {
          icon: 'Coffee',
          label: 'Coffee consumed',
          value: '500+ cups',
        },
        {
          icon: 'BookOpen',
          label: 'Case studies analyzed',
          value: '100+',
        },
        {
          icon: 'TrendingUp',
          label: 'Market research reports',
          value: '50+',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.About ||
  mongoose.model<IAbout>('About', AboutSchema);
