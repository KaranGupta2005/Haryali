import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true 
  }
);

emailSchema.index({ email: 1 });
emailSchema.index({ subscribed: 1 });

export default mongoose.model("Email", emailSchema);