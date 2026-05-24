import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  hashedPassword: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster authentication lookups
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
