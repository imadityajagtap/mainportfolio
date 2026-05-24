import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  issuer: string;
  description: string;
  credentialUrl: string;
  imageUrl: string;
  type: string;
  rank: string;
  verified: boolean;
  badge: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Award',
      trim: true,
    },
    rank: {
      type: String,
      default: '',
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
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

AchievementSchema.pre('validate', function syncAchievementAliases() {
  if (!this.imageUrl && this.badge) {
    this.imageUrl = this.badge;
  }
  if (!this.badge && this.imageUrl) {
    this.badge = this.imageUrl;
  }
  if (!this.type && this.category) {
    this.type = this.category;
  }
  if (!this.category && this.type) {
    this.category = this.type;
  }
});

// Index for sorting by date
AchievementSchema.index({ date: -1 });

export default mongoose.models.Achievement ||
  mongoose.model<IAchievement>('Achievement', AchievementSchema);
