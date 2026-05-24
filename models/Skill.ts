import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  category: 'Financial' | 'Strategy' | 'Analytical' | 'Soft Skills';
  name: string;
  icon: string;
  proficiency: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Financial', 'Strategy', 'Analytical', 'Soft Skills'],
        message: '{VALUE} is not a valid category',
      },
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: 'Star',
      trim: true,
    },
    proficiency: {
      type: Number,
      default: 3,
      min: [1, 'Proficiency must be at least 1'],
      max: [4, 'Proficiency must be at most 4'],
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

// Index for faster sorting
SkillSchema.index({ category: 1, order: 1 });

export default mongoose.models.Skill ||
  mongoose.model<ISkill>('Skill', SkillSchema);
