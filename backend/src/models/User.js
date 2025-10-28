import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['farmer', 'buyer', 'admin', 'logistics'],
      default: 'farmer',
      lowercase: true,
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, 
        },
      },
    ],
  },
  { 
    timestamps: true 
  }
);

userSchema.index({ email: 1 });
userSchema.index({ 'refreshTokens.token': 1 });

export default mongoose.model('User', userSchema);

