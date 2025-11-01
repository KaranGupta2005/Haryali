import mongoose from "mongoose";

const ParaliListingSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: [true, "Farmer name is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  cropType: {
    type: String,
    required: [true, "Crop type is required"],
    enum: ["Wheat", "Rice", "Maize", "Sugarcane"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0.1, "Quantity must be greater than 0"],
  },
  proposedPrice: {
    type: Number,
    default: 0,
    min: [0, "Proposed price cannot be negative"],
  },
  predictedPrice: {
    type: Number,
    default: 0,
    min: [0, "Predicted price cannot be negative"],
  },
  contact: {
    type: String,
    required: [true, "Contact number is required"],
    match: [/^[0-9]{10}$/, "Contact number must be 10 digits"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Parali", ParaliListingSchema);
