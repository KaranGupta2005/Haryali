import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parali",
      required: true,
    },
    cropType: { type: String, required: true },
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true }, 
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Ordered", "In Transit", "Delivered"],
      default: "Ordered",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Buyer", buyerSchema);

