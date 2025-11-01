import mongoose from "mongoose";

const paraliSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    location: { type: String, required: true },
    cropType: {
      type: String,
      enum: ["Standing Stubble", "Loose Straw"],
      required: true,
    },
    quantity: { type: Number, required: true }, // tons
    contact: { type: String, required: true },
    proposedPrice: { type: Number },
    predictedPrice: { type: Number },
    status: {
      type: String,
      enum: ["Pending", "Listed", "Sold"],
      default: "Pending",
    },
    isListedForMarketplace: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Parali", paraliSchema);



