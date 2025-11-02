import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  logistics: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending", "Active", "In Transit", "Completed"],
    default: "Pending",
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);



